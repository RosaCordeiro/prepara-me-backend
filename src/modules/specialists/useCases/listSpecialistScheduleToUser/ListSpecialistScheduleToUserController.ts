import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSpecialistScheduleToUserUseCase } from './ListSpecialistScheduleToUserUseCase';

class ListSpecialistScheduleToUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        let {
            dateBegin,
            dateEnd,
            specialistId
        } = request.query;

        const listSpecialistScheduleToUserUseCase = container.resolve(
            ListSpecialistScheduleToUserUseCase
        )

        const specialistSchedules = await listSpecialistScheduleToUserUseCase.execute({
            dateBegin,
            dateEnd,
            specialistId
        })

        return response.status(201).json(specialistSchedules)
    }
}

export { ListSpecialistScheduleToUserController }