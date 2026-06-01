import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteMentoringUseCase } from "./DeleteMentoringUseCase";

class DeleteMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const deleteMentoringUseCase = container.resolve(
            DeleteMentoringUseCase
        );

        const { mentoringId } = request.params;

        await deleteMentoringUseCase.execute(mentoringId);

        return response.status(200).json({
            message: "Mentoring deleted successfully",
        });
    }
}

export { DeleteMentoringController };

