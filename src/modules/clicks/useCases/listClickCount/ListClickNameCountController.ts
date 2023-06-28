import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListClickNameCountUseCase } from "./ListClickNameCountUseCase";

class ListClickNameCountController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listClickNameCountUseCase = container.resolve(
            ListClickNameCountUseCase
        );

        const createClick = await listClickNameCountUseCase.execute();

        return response.status(200).json(createClick);
    }
}

export { ListClickNameCountController };

