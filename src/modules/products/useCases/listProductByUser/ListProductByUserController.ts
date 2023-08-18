import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductByUserUseCase } from "./ListProductByUserUseCase";

class ListProductByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, productId, onlyAvailables = "false" } = request.query;

        const listProductByUserUseCase = container.resolve(
            ListProductByUserUseCase
        );

        console.log(typeof onlyAvailables);

        const res = await listProductByUserUseCase.execute(
            String(userId),
            onlyAvailables === "true",
            String(productId)
        );

        return response.status(200).send(res);
    }
}

export { ListProductByUserController };
