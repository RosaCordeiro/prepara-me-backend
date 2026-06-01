import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class RemoveParticipantMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider
    ) {}

    async execute(mentoringId: string, userId: string): Promise<void> {
        if (
            mentoringId === null ||
            mentoringId === undefined ||
            mentoringId === ""
        ) {
            throw new AppError("Mentoring id can't be null");
        }

        if (userId === null || userId === undefined || userId === "") {
            throw new AppError("User id can't be null");
        }

        const mentoringObj = await this.mentoringRepository.findById(
            mentoringId
        );

        if (mentoringObj === null || mentoringObj === undefined) {
            throw new AppError("Mentoring not found");
        }

        const user = await this.userRepository.findById(userId);

        if (user === null || user === undefined) {
            throw new AppError("User not found");
        }

        mentoringObj.users = mentoringObj.users - 1;
        mentoringObj.usersMentoring = mentoringObj.usersMentoring.filter(
            (userMentoring) => userMentoring.id !== user.id
        );

        const newMentoring: any = JSON.parse(JSON.stringify(mentoringObj));
        delete newMentoring.mentor;
        newMentoring.mentorId = mentoringObj.mentor.id;

        await this.mentoringRepository.update(mentoringId, {
            ...newMentoring,
        });

        await this.scheduleGoogle.removeAttendeeInEventByLink(
            mentoringObj.eventId,
            user.email
        );
    }
}

export { RemoveParticipantMentoringUseCase };

