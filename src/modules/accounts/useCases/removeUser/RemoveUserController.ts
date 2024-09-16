import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveUserUseCase } from "./RemoveUserUseCase";

class RemoveUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id) {
            return response.status(400).send({
                message:
                    "É necessário informar o id do usuário para realizar a remoção.",
            });
        }

        let removeUserUseCase = container.resolve(RemoveUserUseCase);

        const users = await removeUserUseCase.execute(id);

        return response.status(200).send(users);
    }
}

export { RemoveUserController };
