import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserProductAvailableUseCase } from "./UpdateUserProductAvailableUseCase";

class UpdateUserProductAvailableController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id, productId } = request.body;

        const updateUserProductAvailableUseCase = container.resolve(
            UpdateUserProductAvailableUseCase
        );

        const userProductAvailable =
            await updateUserProductAvailableUseCase.execute(id, productId);

        return response.status(201).send(userProductAvailable);
    }
}

export { UpdateUserProductAvailableController };
