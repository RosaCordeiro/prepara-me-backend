import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class RateMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(
        mentoringId: string,
        userId: string,
        rate: number
    ): Promise<void> {
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

        await this.mentoringRepository.rateMentoring(mentoringId, userId, rate);
    }
}

export { RateMentoringUseCase };

