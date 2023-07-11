import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveParticipantMentoringUseCase } from "./RemoveParticipantMentoringUseCase";

class RemoveParticipantMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const removeParticipantMentoringUseCase = container.resolve(
            RemoveParticipantMentoringUseCase
        );

        if (!request.user) {
            throw new Error("User not found");
        }

        const { mentoringId } = request.body;
        const { id } = request.user;

        await removeParticipantMentoringUseCase.execute(mentoringId, id);

        return response.status(200).json({
            message: "Participant removed successfully",
        });
    }
}

export { RemoveParticipantMentoringController };

