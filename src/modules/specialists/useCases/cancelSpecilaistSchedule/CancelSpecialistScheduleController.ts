import { Request, Response } from "express";
import { container } from "tsyringe";
import { CancelSpecialistScheduleUseCase } from "./CancelSpecialistScheduleUseCase";

class CancelSpecialistScheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { revertAvailableProduct } = request.body;

        const cancelSpecialistScheduleUseCase = container.resolve(
            CancelSpecialistScheduleUseCase
        );

        const specialistScheduleUpdated =
            await cancelSpecialistScheduleUseCase.execute(
                {
                    id,
                    revertAvailableProduct,
                },
                request.user.id
            );

        return response.status(201).json(specialistScheduleUpdated);
    }
}

export { CancelSpecialistScheduleController };
