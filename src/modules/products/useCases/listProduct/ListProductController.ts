import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductUseCase } from "./ListProductUseCase";

class ListProductController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const { name, shortName, status, type, bestSeller, onlyAdmin } = request.query;

        let listProductUseCase = container.resolve(ListProductUseCase);

        const products = await listProductUseCase.execute({
            name,
            shortName,
            status,
            type,
            bestSeller,
            id,
            onlyAdmin
        });

        return response.status(200).send(products)
    }
}

export { ListProductController };

