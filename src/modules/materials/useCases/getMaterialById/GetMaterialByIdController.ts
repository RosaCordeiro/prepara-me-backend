import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMaterialByIdUseCase } from "./GetMaterialByIdUseCase";

class GetMaterialByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const getMaterialByIdUseCase = container.resolve(
            GetMaterialByIdUseCase
        );

        if (!request.params.id || request.params.id === "") {
            return response.status(400).json("Slug is required");
        }

        const material = await getMaterialByIdUseCase.execute(
            request.params.id
        );

        return response.status(200).json(material);
    }
}

export { GetMaterialByIdController };
