import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductByPriceUseCase } from "./ListProductByPriceUseCase";

class ListProductByPriceController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        let listProductByPriceUseCase = container.resolve(
            ListProductByPriceUseCase
        );

        const products = await listProductByPriceUseCase.execute(id);

        return response.status(200).send(products);
    }
}

export { ListProductByPriceController };
