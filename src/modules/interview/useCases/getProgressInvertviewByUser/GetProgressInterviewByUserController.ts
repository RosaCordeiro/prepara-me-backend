import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetProgressInterviewByUserUseCase } from "./GetProgressInterviewByUserUseCase";

class GetProgressInterviewByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const getProgressInterviewByUserUseCase = container.resolve(
            GetProgressInterviewByUserUseCase
        );

        const progressInterview =
            await getProgressInterviewByUserUseCase.execute(
                request.params.user_id
            );

        return response.status(200).json(progressInterview);
    }
}

export { GetProgressInterviewByUserController };
