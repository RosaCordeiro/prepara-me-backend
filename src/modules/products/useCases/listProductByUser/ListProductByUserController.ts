import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductByUserUseCase } from "./ListProductByUserUseCase";

class ListProductByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, productId } = request.query;

        const listProductByUserUseCase = container.resolve(
            ListProductByUserUseCase
        );

        const res = await listProductByUserUseCase.execute(
            String(userId),
            String(productId)
        );

        return response.status(200).send(res);
    }
}

export { ListProductByUserController };

