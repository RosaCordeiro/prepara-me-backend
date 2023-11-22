import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindAllMaterialUseCase } from "./FindlAllMaterialUseCase";

class FindAllMaterialController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findAllMaterialUseCase = container.resolve(
            FindAllMaterialUseCase
        );

        const material = await findAllMaterialUseCase.execute();

        return response.status(200).json(material);
    }
}

export { FindAllMaterialController };
