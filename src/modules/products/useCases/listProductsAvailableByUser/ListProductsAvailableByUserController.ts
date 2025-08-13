import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductsAvailableByUserUseCase } from "./ListProductsAvailableByUserUseCase";

class ListProductsAvailableByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, onlyAvailables, onlyAdmin } = request.query;
        const listProductsAvailableByUserUseCase = container.resolve(
            ListProductsAvailableByUserUseCase
        );

        const res = await listProductsAvailableByUserUseCase.execute(
            String(userId),
            onlyAvailables === "true",
            onlyAdmin === "true"
        );

        return response.status(200).send(res);
    }
}

export { ListProductsAvailableByUserController };
