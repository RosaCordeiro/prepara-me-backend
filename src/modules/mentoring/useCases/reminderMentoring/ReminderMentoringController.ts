import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReminderMentoringUseCase } from "./ReminderMentoringUseCase";

class ReminderMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const reminderMentoringUseCase = container.resolve(
            ReminderMentoringUseCase
        );

        if (!request.user) {
            throw new Error("User not found");
        }

        const { mentoringId } = request.body;
        const { id } = request.user;

        await reminderMentoringUseCase.execute(mentoringId, id);

        return response.status(200).json({
            message: "Participant removed successfully",
        });
    }
}

export { ReminderMentoringController };
