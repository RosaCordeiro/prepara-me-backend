import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserProductsAvailableUseCase } from "./ListUserProductsAvailableUseCase";

class ListUserProductsAvailableController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { userId, productId, onlyAdmin } = request.query;

        let listUserProductsAvailableUseCase = container.resolve(
            ListUserProductsAvailableUseCase
        );

        const userProductsAvailable =
            await listUserProductsAvailableUseCase.execute({
                id,
                productId,
                userId,
                onlyAdmin: onlyAdmin === 'true'
            });

        return response.status(200).send(userProductsAvailable);
    }
}

export { ListUserProductsAvailableController };

