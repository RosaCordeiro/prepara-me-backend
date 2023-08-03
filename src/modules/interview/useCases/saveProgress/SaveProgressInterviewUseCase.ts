import { ISaveProgressInterviewDTO } from "@modules/interview/dtos/ISaveProgressInterviewDTO";
import { ProgressInterview } from "@modules/interview/infra/typeorm/entities/ProgressInterview";
import { ProgressInterviewRepository } from "@modules/interview/infra/typeorm/repository/ProgressInterviewRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class SaveProgressInterviewUseCase {
    constructor(
        @inject("ProgressInterviewRepository")
        private progressInterviewRepository: ProgressInterviewRepository
    ) {}

    async execute(data: ISaveProgressInterviewDTO): Promise<ProgressInterview> {
        if (
            !data.user_id ||
            data.user_id === "" ||
            data.user_id === undefined ||
            data.user_id === null
        ) {
            throw new AppError("User id incorrect!");
        }

        const response =
            await this.progressInterviewRepository.getProgressInterviewByUserId(
                data.user_id
            );

        if (response) {
            if (
                data.group === response.group &&
                data.video === response.video
            ) {
                return response;
            }
        }

        const progressInterview =
            await this.progressInterviewRepository.saveProgress(data);

        return progressInterview;
    }
}

export { SaveProgressInterviewUseCase };
