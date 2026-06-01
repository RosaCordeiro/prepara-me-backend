import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateClickCountUseCase } from "./CreateClickCountUseCase";

class CreateClickCountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.body;

        const createClickCountUseCase = container.resolve(
            CreateClickCountUseCase
        );

        const createClick = await createClickCountUseCase.execute({
            name,
        });

        return response.status(201).json(createClick);
    }
}

export { CreateClickCountController };

