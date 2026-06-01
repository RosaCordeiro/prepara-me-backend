import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCompanyEmployeeBatchUseCase } from "./CreateCompanyEmployeeBatchUseCase";

import fs from "fs";

class CreateCompanyEmployeeBatchController {
    async handle(request: Request, response: Response): Promise<Response> {
        if (request.files.length === 0) {
            return response.status(400).send({
                message: "No files uploaded",
            });
        }

        const createCompanyEmployeeBatchUseCase = container.resolve(
            CreateCompanyEmployeeBatchUseCase
        );

        const res = await createCompanyEmployeeBatchUseCase.execute(
            request.files
        );

        for (const file of request.files as any[]) {
            const path = file.filepath;
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }

        if (!res.success) {
            return response.status(400).send({
                message:
                    res.message || "Error on create company employee batch",
            });
        }

        return response.status(201).send({
            message: res.message || "Company employee batch created",
        });
    }
}

export { CreateCompanyEmployeeBatchController };
