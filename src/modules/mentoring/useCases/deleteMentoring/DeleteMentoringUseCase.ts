import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class DeleteMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute(mentoringId: string): Promise<void> {
        if (
            mentoringId === null ||
            mentoringId === undefined ||
            mentoringId === ""
        ) {
            throw new AppError("Mentoring id can't be null");
        }

        const mentoringObj = await this.mentoringRepository.findById(
            mentoringId
        );

        if (mentoringObj === null || mentoringObj === undefined) {
            throw new AppError("Mentoring not found");
        }

        try {
            await this.scheduleGoogle.cancelScheduledEvent(
                "primary",
                mentoringObj.eventId
            );
        } catch (error) {
            console.log(error);
        }

        await this.mentoringRepository.removeUsers(mentoringId);
        await this.mentoringRepository.delete(mentoringId);
        await this.storageProvider.delete(mentoringObj.image, "mentoring");
    }

    validInput(content: ICreateMentoringDTO): void {
        if (
            content.title === null ||
            content.title === "" ||
            content.title === undefined
        ) {
            throw new AppError("Title can't be null");
        }

        if (
            content.mentorId === null ||
            content.mentorId === "" ||
            content.mentorId === undefined
        ) {
            throw new AppError("Mentor can't be null");
        }

        if (content.date === null || content.date === undefined) {
            throw new AppError("Date can't be null");
        }
    }
}

export { DeleteMentoringUseCase };
