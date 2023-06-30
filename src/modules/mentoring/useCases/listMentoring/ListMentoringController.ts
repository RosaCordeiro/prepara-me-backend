import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMentoringUseCase } from "./ListMentoringUseCase";

class ListMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listMentoringUseCase = container.resolve(ListMentoringUseCase);

        const createMentoring = await listMentoringUseCase.execute();

        return response.status(200).json(createMentoring);
    }
}

export { ListMentoringController };

