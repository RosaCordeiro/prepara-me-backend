import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetProductByIdUseCase } from "./GetProductByIdUseCase";

class GetProductByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { productId } = request.params;

        console.log(productId);

        const getProductByIdUseCase = container.resolve(GetProductByIdUseCase);

        const product = await getProductByIdUseCase.execute(productId);

        return response.status(200).json(product);
    }
}

export { GetProductByIdController };
