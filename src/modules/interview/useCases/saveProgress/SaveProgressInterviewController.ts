import { Request, Response } from "express";
import { container } from "tsyringe";
import { SaveProgressInterviewUseCase } from "./SaveProgressInterviewUseCase";

class SaveProgressInterviewController {
    async handle(request: Request, response: Response): Promise<Response> {
        const saveProgressInterviewUseCase = container.resolve(
            SaveProgressInterviewUseCase
        );

        const progressInterview = await saveProgressInterviewUseCase.execute(
            request.body
        );

        return response.status(201).json(progressInterview);
    }
}

export { SaveProgressInterviewController };
