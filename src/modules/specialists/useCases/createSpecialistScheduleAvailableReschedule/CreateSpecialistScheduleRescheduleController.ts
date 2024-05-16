import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistScheduleRescheduleUseCase } from "./CreateSpecialistScheduleRescheduleUseCase";

class CreateSpecialistScheduleRescheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            dateSchedule,
            status,
            specialistId,
            productId,
            userId,
            comments,
            hangoutLink,
            scheduleEventId,
            createEvent,
            rating,
            oldScheduleId,
        } = request.body;

        const { id } = request.params;

        const createSpecialistScheduleRescheduleUseCase = container.resolve(
            CreateSpecialistScheduleRescheduleUseCase
        );

        console.log("dateSchedule", {
            dateSchedule,
            specialistId,
            status,
            productId,
            userId,
            comments,
            hangoutLink,
            scheduleEventId,
            id,
            createEvent,
            rating,
            oldScheduleId,
        });

        const specialistSchedule =
            await createSpecialistScheduleRescheduleUseCase.execute({
                dateSchedule,
                specialistId,
                status,
                productId,
                userId,
                comments,
                hangoutLink,
                scheduleEventId,
                id,
                createEvent,
                rating,
                oldScheduleId,
            });

        return response.status(201).json(specialistSchedule);
    }
}

export { CreateSpecialistScheduleRescheduleController };
