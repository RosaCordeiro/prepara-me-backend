import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMentoringScheduleUseCase } from "./ListMentoringScheduleUseCase";
import { AppError } from "@shared/errors/AppError";

class ListMentoringScheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, dateBegin, dateEnd } = request.query;

        const listMentoringScheduleUseCase = container.resolve(
            ListMentoringScheduleUseCase
        );

        const createMentoring = await listMentoringScheduleUseCase.execute(
            String(userId),
            String(dateBegin),
            String(dateEnd)
        );

        return response.status(200).json(createMentoring);
    }
}

export { ListMentoringScheduleController };

