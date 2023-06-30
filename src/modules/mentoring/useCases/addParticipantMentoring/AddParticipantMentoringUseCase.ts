import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class AddParticipantMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider
    ) {}

    async execute(mentoringId: string, email: string): Promise<void> {
        if (
            mentoringId === null ||
            mentoringId === undefined ||
            mentoringId === ""
        ) {
            throw new AppError("Mentoring id can't be null");
        }

        if (email === null || email === undefined || email === "") {
            throw new AppError("Email can't be null");
        }

        const mentoringObj = await this.mentoringRepository.findById(
            mentoringId
        );

        if (mentoringObj === null || mentoringObj === undefined) {
            throw new AppError("Mentoring not found");
        }

        if (mentoringObj.users >= mentoringObj.vacancies) {
            throw new AppError("Mentoring is full");
        }

        await this.scheduleGoogle.addAttendeeInEventByLink(
            mentoringObj.eventId,
            email
        );

        mentoringObj.users = mentoringObj.users + 1;

        await this.mentoringRepository.update(mentoringId, mentoringObj);
    }

    validInput(content: ICreateMentoringDTO): void {
        console.log(content);
        console.log(content.title);

        if (
            content.title === null ||
            content.title === "" ||
            content.title === undefined
        ) {
            throw new AppError("Title can't be null");
        }

        if (
            content.mentor === null ||
            content.mentor === "" ||
            content.mentor === undefined
        ) {
            throw new AppError("Mentor can't be null");
        }

        if (content.date === null || content.date === undefined) {
            throw new AppError("Date can't be null");
        }
    }
}

export { AddParticipantMentoringUseCase };

