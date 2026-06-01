import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductByUserUseCase } from "./ListProductByUserUseCase";

class ListProductByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, productId, onlyAvailables = "false", onlyAdmin } = request.query;

        const listProductByUserUseCase = container.resolve(
            ListProductByUserUseCase
        );

        const res = await listProductByUserUseCase.execute(
            String(userId),
            onlyAvailables === "true",
            String(productId),
            onlyAdmin === "true"
        );

        return response.status(200).send(res);
    }
}

export { ListProductByUserController };
