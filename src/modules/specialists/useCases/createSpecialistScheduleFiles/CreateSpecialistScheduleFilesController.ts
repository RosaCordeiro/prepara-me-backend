import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistScheduleFilesUseCase } from "./CreateSpecialistScheduleFilesUseCase";

class CreateSpecialistScheduleFilesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {

            
        } = request.body;        

        const createSpecialistScheduleFilesUseCase = container.resolve(
            CreateSpecialistScheduleFilesUseCase
        );

        const specialistSchedule =
            await createSpecialistScheduleFilesUseCase.execute({});

        return response.status(201).json(specialistSchedule);
    }
}

export { CreateSpecialistScheduleFilesController };
