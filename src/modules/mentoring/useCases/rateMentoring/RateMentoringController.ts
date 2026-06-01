import { Request, Response } from "express";
import { container } from "tsyringe";
import { RateMentoringUseCase } from "./RateMentoringUseCase";

class RateMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const rateMentoringUseCase = container.resolve(RateMentoringUseCase);

        if (!request.user) {
            throw new Error("User not found");
        }

        const { id } = request.user;
        const { mentoringId, rate } = request.body;

        await rateMentoringUseCase.execute(mentoringId, id, rate);

        return response.status(200).json({
            message: "Participant added successfully",
        });
    }
}

export { RateMentoringController };

