import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class ReminderMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(mentoringId: string, userId: string): Promise<void> {}
}

export { ReminderMentoringUseCase };
