import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteMaterialUseCase } from "./DeleteMaterialUseCase";

class DeleteMaterialController {
    async handle(request: Request, response: Response): Promise<Response> {
        const deleteMaterialUseCase = container.resolve(DeleteMaterialUseCase);

        if (!request.params.id || request.params.id === "") {
            return response.status(400).json("Id is required");
        }

        await deleteMaterialUseCase.execute(request.params.id);

        return response.status(200).json({
            message: "Material deleted",
        });
    }
}

export { DeleteMaterialController };
