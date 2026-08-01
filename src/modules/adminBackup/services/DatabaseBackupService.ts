import { spawn } from "child_process";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { AppError } from "@shared/errors/AppError";

export type BackupFileInfo = {
    fileName: string;
    sizeBytes: number;
    createdAt: string;
    sha256?: string;
};

const FILE_NAME_REGEX = /^preparame_prod_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.sql$/;
const MIN_BYTES = 10 * 1024;
const KEEP_LAST = Number(process.env.DB_BACKUP_KEEP_LAST || 10);

let backupInProgress = false;

function assertFeatureEnabled() {
    if (process.env.ENABLE_DB_BACKUP_API !== "true") {
        throw new AppError(
            "API de backup desabilitada. Defina ENABLE_DB_BACKUP_API=true no servidor.",
            403
        );
    }
}

function resolveBackupRoot(): string {
    const candidates = [
        process.env.BACKUP_ROOT,
        "/var/backups/preparame",
        "/var/www/preparame/backups",
        path.join(process.cwd(), "backups"),
        path.join("/tmp", "preparame-backups"),
    ].filter(Boolean) as string[];

    for (const dir of candidates) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            fs.accessSync(dir, fs.constants.W_OK);
            return dir;
        } catch {
            // try next
        }
    }

    throw new AppError("Não foi possível criar pasta gravável para backups", 500);
}

function normalizeDbHost(host: string): string {
    if (host === "database" || host === "host.docker.internal") {
        return "127.0.0.1";
    }
    return host;
}

function getDbConfig() {
    return {
        host: normalizeDbHost(process.env.DB_HOST || "127.0.0.1"),
        port: String(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "usprepareme",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "preparame",
    };
}

function safeResolveBackupFile(fileName: string): string {
    if (!FILE_NAME_REGEX.test(fileName)) {
        throw new AppError("Nome de arquivo inválido", 400);
    }

    const root = path.resolve(resolveBackupRoot());
    const full = path.resolve(root, fileName);

    if (!full.startsWith(root + path.sep) && full !== root) {
        throw new AppError("Caminho de arquivo inválido", 400);
    }

    if (!fs.existsSync(full)) {
        throw new AppError("Backup não encontrado", 404);
    }

    return full;
}

function pruneOldBackups(root: string) {
    const files = fs
        .readdirSync(root)
        .filter((name) => FILE_NAME_REGEX.test(name))
        .map((name) => ({
            name,
            mtime: fs.statSync(path.join(root, name)).mtimeMs,
        }))
        .sort((a, b) => b.mtime - a.mtime);

    for (const old of files.slice(KEEP_LAST)) {
        const base = path.join(root, old.name);
        for (const suffix of ["", ".sha256", ".meta"]) {
            const p = `${base}${suffix}`;
            if (fs.existsSync(p)) {
                fs.unlinkSync(p);
            }
        }
    }
}

async function runPgDump(outFile: string): Promise<void> {
    const db = getDbConfig();

    await new Promise<void>((resolve, reject) => {
        const child = spawn(
            "pg_dump",
            [
                "-h",
                db.host,
                "-p",
                db.port,
                "-U",
                db.user,
                "-d",
                db.database,
                "--no-owner",
                "--no-acl",
                "-f",
                outFile,
            ],
            {
                env: {
                    ...process.env,
                    PGPASSWORD: db.password,
                },
            }
        );

        let stderr = "";
        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", (err) => {
            reject(
                new AppError(
                    `Falha ao iniciar pg_dump: ${err.message}. Instale postgresql-client no servidor.`,
                    500
                )
            );
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(
                new AppError(
                    `pg_dump falhou (code=${code}): ${stderr || "sem detalhes"}`,
                    500
                )
            );
        });
    });
}

function sha256File(filePath: string): string {
    const hash = createHash("sha256");
    hash.update(fs.readFileSync(filePath));
    return hash.digest("hex");
}

class DatabaseBackupService {
    assertEnabled() {
        assertFeatureEnabled();
    }

    list(): BackupFileInfo[] {
        assertFeatureEnabled();
        const root = resolveBackupRoot();

        return fs
            .readdirSync(root)
            .filter((name) => FILE_NAME_REGEX.test(name))
            .map((fileName) => {
                const full = path.join(root, fileName);
                const st = fs.statSync(full);
                const shaPath = `${full}.sha256`;
                let sha256: string | undefined;
                if (fs.existsSync(shaPath)) {
                    sha256 = fs.readFileSync(shaPath, "utf8").split(/\s+/)[0];
                }
                return {
                    fileName,
                    sizeBytes: st.size,
                    createdAt: st.mtime.toISOString(),
                    sha256,
                };
            })
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    async create(): Promise<BackupFileInfo> {
        assertFeatureEnabled();

        if (backupInProgress) {
            throw new AppError("Já existe um backup em andamento", 409);
        }

        backupInProgress = true;

        try {
            const root = resolveBackupRoot();
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
                now.getDate()
            )}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
                now.getSeconds()
            )}`;
            const fileName = `preparame_prod_${stamp}.sql`;
            const outFile = path.join(root, fileName);

            await runPgDump(outFile);

            const sizeBytes = fs.statSync(outFile).size;
            if (sizeBytes < MIN_BYTES) {
                fs.unlinkSync(outFile);
                throw new AppError(
                    `Dump suspeito (${sizeBytes} bytes). Abortado.`,
                    500
                );
            }

            const digest = sha256File(outFile);
            fs.writeFileSync(`${outFile}.sha256`, `${digest}  ${outFile}\n`);
            fs.writeFileSync(
                `${outFile}.meta`,
                [
                    `created_at=${stamp}`,
                    `bytes=${sizeBytes}`,
                    `file=${outFile}`,
                    `source=api`,
                ].join("\n") + "\n"
            );

            pruneOldBackups(root);

            return {
                fileName,
                sizeBytes,
                createdAt: now.toISOString(),
                sha256: digest,
            };
        } finally {
            backupInProgress = false;
        }
    }

    getAbsolutePath(fileName: string): string {
        assertFeatureEnabled();
        return safeResolveBackupFile(fileName);
    }
}

export { DatabaseBackupService };
