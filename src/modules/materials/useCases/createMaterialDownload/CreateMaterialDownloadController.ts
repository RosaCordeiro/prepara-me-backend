import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMaterialDownloadUseCase } from "./CreateMaterialDownloadUseCase";

class CreateMaterialDownloadController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createMaterialDownloadUseCase = container.resolve(
            CreateMaterialDownloadUseCase
        );

        const { material_id } = request.params;

        const createMentoring = await createMaterialDownloadUseCase.execute({
            ...request.body,
            material_id,
        });

        return response.status(201).json(createMentoring);
    }
}

export { CreateMaterialDownloadController };
