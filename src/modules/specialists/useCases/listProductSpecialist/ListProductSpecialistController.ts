import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductSpecialistUseCase } from "./ListProductSpecialistUseCase";

class ListProductSpecialistController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { productId, specialistId } = request.query;

        const { id } = request.params;

        const listProductSpecialistUseCase = container.resolve(
            ListProductSpecialistUseCase
        );

        const listProductSpecialist =
            await listProductSpecialistUseCase.execute({
                id,
                productId,
                specialistId,
            });

        return response.status(201).json(listProductSpecialist);
    }
}

export { ListProductSpecialistController };
