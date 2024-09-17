import { Request, Response } from "express";
import { container } from "tsyringe";
import { CancelSpecialistScheduleUseCase } from "./CancelSpecialistScheduleUseCase";

class CancelSpecialistScheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { revertAvailableProduct, reason } = request.body;

        const cancelSpecialistScheduleUseCase = container.resolve(
            CancelSpecialistScheduleUseCase
        );
        console.log('Iniciando cancelamento da agenda', revertAvailableProduct);
        console.log('id', id);
        
        const specialistScheduleUpdated =
            await cancelSpecialistScheduleUseCase.execute(
                {
                    id,
                    revertAvailableProduct,
                    reason,
                },
                request.user.id
            );

        return response.status(201).json(specialistScheduleUpdated);
    }
}

export { CancelSpecialistScheduleController };
