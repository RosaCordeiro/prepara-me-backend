import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReminderMentoringUseCase } from "./ReminderMentoringUseCase";

class ReminderMentoringController {
    async handleInternal(): Promise<void> {
        const reminderMentoringUseCase = container.resolve(
            ReminderMentoringUseCase
        );

        await reminderMentoringUseCase.execute();
    }
}

export { ReminderMentoringController };
