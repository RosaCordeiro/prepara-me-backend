import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMentoringScheduleUseCase } from "./ListMentoringScheduleUseCase";
import { AppError } from "@shared/errors/AppError";

class ListMentoringScheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, dateBegin, dateEnd, specialistUserId } = request.query;

        const listMentoringScheduleUseCase = container.resolve(
            ListMentoringScheduleUseCase
        );

        const createMentoring = await listMentoringScheduleUseCase.execute(
            userId ?? specialistUserId,
            String(dateBegin),
            String(dateEnd),
            userId !== undefined ? "user" : "specialist"
        );

        return response.status(200).json(createMentoring);
    }
}

export { ListMentoringScheduleController };

