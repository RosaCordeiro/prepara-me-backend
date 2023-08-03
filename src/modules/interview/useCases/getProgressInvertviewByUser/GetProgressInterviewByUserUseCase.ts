import { ProgressInterviewRepository } from "@modules/interview/infra/typeorm/repository/ProgressInterviewRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class GetProgressInterviewByUserUseCase {
    constructor(
        @inject("ProgressInterviewRepository")
        private progressInterviewRepository: ProgressInterviewRepository
    ) {}

    async execute(user_id: string): Promise<any> {
        if (
            !user_id ||
            user_id === "" ||
            user_id === undefined ||
            user_id === null
        ) {
            throw new Error("User id incorrect!");
        }

        const progressInverview =
            await this.progressInterviewRepository.getProgressInterviewByUserId(
                user_id
            );

        return progressInverview;
    }
}

export { GetProgressInterviewByUserUseCase };
