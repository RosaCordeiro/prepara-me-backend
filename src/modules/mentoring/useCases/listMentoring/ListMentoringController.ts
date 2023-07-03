import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMentoringUseCase } from "./ListMentoringUseCase";

class ListMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { page = 0, limit = 10 } = request.query;

        const listMentoringUseCase = container.resolve(ListMentoringUseCase);

        const createMentoring = await listMentoringUseCase.execute(
            Number(page),
            Number(limit)
        );

        return response.status(200).json(createMentoring);
    }
}

export { ListMentoringController };

