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
const PROD_APP_DIR =
    process.env.PROD_APP_DIR || "/var/www/preparame/api";

let backupInProgress = false;

function assertFeatureEnabled() {
    if (process.env.ENABLE_DB_BACKUP_API !== "true") {
        throw new AppError(
            "API de backup desabilitada. Defina ENABLE_DB_BACKUP_API=true no servidor.",
            403
        );
    }
}

/** Garante credenciais do .env/.ormconfig do app em prod (não só do process no boot). */
function loadServerDbEnv() {
    const envFile = path.join(PROD_APP_DIR, ".env");
    if (fs.existsSync(envFile)) {
        const raw = fs.readFileSync(envFile, "utf8");
        for (const line of raw.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eq = trimmed.indexOf("=");
            if (eq <= 0) continue;
            const key = trimmed.slice(0, eq).trim();
            let value = trimmed.slice(eq + 1).trim();
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            if (
                process.env[key] === undefined ||
                process.env[key] === "" ||
                key.startsWith("DB_") ||
                key === "ENABLE_DB_BACKUP_API" ||
                key === "BACKUP_ROOT"
            ) {
                // Credenciais do .env do app em prod têm prioridade no backup
                if (
                    key.startsWith("DB_") ||
                    key === "ENABLE_DB_BACKUP_API" ||
                    key === "BACKUP_ROOT"
                ) {
                    process.env[key] = value;
                } else if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        }
    }

    const ormFile = path.join(PROD_APP_DIR, "ormconfig.json");
    if (fs.existsSync(ormFile)) {
        try {
            const orm = JSON.parse(fs.readFileSync(ormFile, "utf8")) as {
                host?: string;
                port?: number | string;
                username?: string;
                password?: string;
                database?: string;
            };
            if (!process.env.DB_HOST && orm.host) process.env.DB_HOST = String(orm.host);
            if (!process.env.DB_PORT && orm.port) process.env.DB_PORT = String(orm.port);
            if (!process.env.DB_USER && orm.username)
                process.env.DB_USER = String(orm.username);
            if (!process.env.DB_PASS && orm.password !== undefined)
                process.env.DB_PASS = String(orm.password);
            if (!process.env.DB_NAME && orm.database)
                process.env.DB_NAME = String(orm.database);
        } catch {
            // ignore invalid ormconfig
        }
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
    loadServerDbEnv();
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

    if (!db.password) {
        console.warn(
            "[admin-backup] DB_PASS vazio — pg_dump pode travar na autenticação TCP"
        );
    }

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

        const timer = setTimeout(() => {
            child.kill("SIGTERM");
            reject(
                new AppError(
                    "pg_dump excedeu 3 minutos e foi cancelado (timeout interno)",
                    504
                )
            );
        }, 3 * 60 * 1000);

        child.on("error", (err) => {
            clearTimeout(timer);
            reject(
                new AppError(
                    `Falha ao iniciar pg_dump: ${err.message}. Instale postgresql-client no servidor.`,
                    500
                )
            );
        });

        child.on("close", (code) => {
            clearTimeout(timer);
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
        loadServerDbEnv();
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

    /** Síncrono: só responde quando o dump estiver pronto no disco. */
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
