import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindlAllMaterialPublicUseCase } from "./findAllMaterialPublicUseCase";

class FindAllMaterialPublicController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findAllMaterialUseCase = container.resolve(
            FindlAllMaterialPublicUseCase
        );

        const material = await findAllMaterialUseCase.execute();

        return response.status(200).json(material);
    }
}

export { FindAllMaterialPublicController };
