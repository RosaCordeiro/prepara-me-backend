import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistScheduleUseCase } from "./CreateSpecialistScheduleUseCase";

class CreateSpecialistScheduleController {
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
            timezone,
            offset
        } = request.body;

        const { id } = request.params;

        const userRequestId = request.user.id

        const createSpecialistScheduleUseCase = container.resolve(
            CreateSpecialistScheduleUseCase
        );

        console.log('dateSchedule', {
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
            userRequestId,
            timezone,
            offset
        })

        const specialistSchedule =
            await createSpecialistScheduleUseCase.execute({
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
                userRequestId
            });

        return response.status(201).json(specialistSchedule);
    }
}

export { CreateSpecialistScheduleController };

