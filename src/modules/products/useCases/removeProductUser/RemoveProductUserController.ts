import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveProductUserUseCase } from "./RemoveProductUserUseCase";

class RemoveProductUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const removeProductUserUseCase = container.resolve(
            RemoveProductUserUseCase
        );

        await removeProductUserUseCase.execute(id);

        return response.status(200).send({
            message: "Product removed successfully",
        });
    }
}

export { RemoveProductUserController };

