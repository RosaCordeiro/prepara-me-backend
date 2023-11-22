import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMaterialBySlugUseCase } from "./GetMaterialBySlugUseCase";

class GetMaterialBySlugController {
    async handle(request: Request, response: Response): Promise<Response> {
        const getMaterialBySlugUseCase = container.resolve(
            GetMaterialBySlugUseCase
        );

        if (!request.params.slug || request.params.slug === "") {
            return response.status(400).json("Slug is required");
        }

        const material = await getMaterialBySlugUseCase.execute(
            request.params.slug
        );

        return response.status(200).json(material);
    }
}

export { GetMaterialBySlugController };
