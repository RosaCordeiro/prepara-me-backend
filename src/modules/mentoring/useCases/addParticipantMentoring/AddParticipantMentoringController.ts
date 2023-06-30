import { Request, Response } from "express";
import { container } from "tsyringe";
import { AddParticipantMentoringUseCase } from "./AddParticipantMentoringUseCase";

class AddParticipantMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const addParticipantMentoringUseCase = container.resolve(
            AddParticipantMentoringUseCase
        );

        const { mentoringId, email } = request.body;

        await addParticipantMentoringUseCase.execute(mentoringId, email);

        return response.status(200).json({
            message: "Participant added successfully",
        });
    }
}

export { AddParticipantMentoringController };

