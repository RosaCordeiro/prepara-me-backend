import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";

/**
 * Opcional: se DB_BACKUP_API_TOKEN estiver definido no .env,
 * exige o mesmo valor no header X-Backup-Token.
 */
export function ensureBackupToken(
    request: Request,
    _response: Response,
    next: NextFunction
) {
    const expected = process.env.DB_BACKUP_API_TOKEN;

    if (!expected) {
        return next();
    }

    const provided = String(request.headers["x-backup-token"] || "");

    if (!provided || provided.length !== expected.length) {
        throw new AppError("Token de backup inválido", 403);
    }

    const a = createHash("sha256").update(provided).digest();
    const b = createHash("sha256").update(expected).digest();

    // comparação em tempo constante via hashes de tamanho fixo
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) {
        diff |= a[i] ^ b[i];
    }

    if (diff !== 0) {
        throw new AppError("Token de backup inválido", 403);
    }

    return next();
}
