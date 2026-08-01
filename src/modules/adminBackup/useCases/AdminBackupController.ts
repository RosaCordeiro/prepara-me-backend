import { Request, Response } from "express";
import fs from "fs";
import { DatabaseBackupService } from "@modules/adminBackup/services/DatabaseBackupService";

class AdminBackupController {
    private service = new DatabaseBackupService();

    list = async (_request: Request, response: Response): Promise<Response> => {
        const items = this.service.list();
        return response.status(200).json({
            enabled: true,
            items,
        });
    };

    create = async (
        _request: Request,
        response: Response
    ): Promise<Response> => {
        const item = await this.service.create();
        return response.status(201).json(item);
    };

    download = async (request: Request, response: Response): Promise<void> => {
        const fileName = String(request.params.fileName || "");
        const absolutePath = this.service.getAbsolutePath(fileName);
        const stat = fs.statSync(absolutePath);

        response.setHeader("Content-Type", "application/sql");
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        response.setHeader("Content-Length", String(stat.size));

        fs.createReadStream(absolutePath).pipe(response);
    };
}
export { AdminBackupController };
