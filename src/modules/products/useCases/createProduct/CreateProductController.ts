import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            name,
            shortName,
            price,
            duration,
            status,
            type,
            id,
            bestSeller,
            slug,
            onlyAdmin = "false",
        } = request.body;
        const createProductUseCase = container.resolve(CreateProductUseCase);

        const product = await createProductUseCase.execute({
            name,
            shortName,
            price,
            duration,
            status,
            type,
            bestSeller,
            id,
            slug,
            onlyAdmin : onlyAdmin === "true",
        });

        return response.status(201).json(product);
    }
}

export { CreateProductController };
