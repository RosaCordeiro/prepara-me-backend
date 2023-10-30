import { container } from "tsyringe";
import { Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";
import { RemoveSpecialistScheduleFilesUsecase } from "./removeSpecialistScheduleFilesUseCase";

class RemoveSpecialistScheduleFilesController {
    async handle(request: Request, response: Response): Promise<Response> {
        console.log("teste controller");
        const removeSpecialistFilesUseCase = container.resolve(
            RemoveSpecialistScheduleFilesUsecase
        );

        const { id } = request.params;

        if (!id) {
            throw new AppError("Specialist ID is required");
        }

        const resultFind = await removeSpecialistFilesUseCase.execute({
            specialistScheduleId: request.params.id,
        });

        return response.status(200).json({ message: "Files removed" });
    }
}

export { RemoveSpecialistScheduleFilesController };

