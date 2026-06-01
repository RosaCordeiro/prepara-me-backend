import { Request, Response } from "express";
import { container } from "tsyringe";
import { AddParticipantMentoringUseCase } from "./AddParticipantMentoringUseCase";

class AddParticipantMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const addParticipantMentoringUseCase = container.resolve(
            AddParticipantMentoringUseCase
        );

        if (!request.user) {
            throw new Error("User not found");
        }

        const { mentoringId } = request.body;
        const { id } = request.user;

        await addParticipantMentoringUseCase.execute(mentoringId, id);

        return response.status(200).json({
            message: "Participant added successfully",
        });
    }
}

export { AddParticipantMentoringController };

