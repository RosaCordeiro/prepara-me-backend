import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMentoringByIdUseCase } from "./GetMentoringByIdUseCase";

class GetMentoringByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { mentoringId } = request.params;

        const getMentoringByIdUseCase = container.resolve(
            GetMentoringByIdUseCase
        );

        const createMentoring = await getMentoringByIdUseCase.execute(
            mentoringId
        );

        return response.status(200).json(createMentoring);
    }
}

export { GetMentoringByIdController };

