import { container } from "tsyringe";
import { Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";

import { ListSpecialistScheduleFilesUseCase } from "./ListSpecialistScheduleFilesUseCase";

class ListSpecialistScheduleFilesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listSpecialistShechuleFilesUseCase = container.resolve(
            ListSpecialistScheduleFilesUseCase
        );

        const { id } = request.params;
        const type: any = request.query.type;

        if (!id) {
            throw new AppError("Specialist Schedule ID is required");
        }

        if (type && type !== "USER" && type !== "SPECIALIST") {
            throw new AppError("Invalid file type. USER or SPECIALIST");
        }

        const resultFind = await listSpecialistShechuleFilesUseCase.execute({
            specialistScheduleId: request.params.id,
            fileType: type ?? undefined,
        });

        return response.status(200).json(resultFind);
    }
}

export { ListSpecialistScheduleFilesController };
