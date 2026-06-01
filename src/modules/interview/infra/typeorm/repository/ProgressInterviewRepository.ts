import { ISaveProgressInterviewDTO } from "@modules/interview/dtos/ISaveProgressInterviewDTO";
import { IProgressInterviewRepository } from "@modules/interview/repositories/IProgressInterviewRepository";
import { getRepository, Repository } from "typeorm";
import { ProgressInterview } from "../entities/ProgressInterview";

class ProgressInterviewRepository implements IProgressInterviewRepository {
    private repository: Repository<ProgressInterview>;

    constructor() {
        this.repository = getRepository(ProgressInterview);
    }
    async saveProgress(
        data: ISaveProgressInterviewDTO
    ): Promise<ProgressInterview> {
        const progressInterview: ProgressInterview =
            this.repository.create(data);

        await this.repository.save(progressInterview);

        return progressInterview;
    }

    getProgressInterviewByUserId(user_id: string): Promise<ProgressInterview> {
        return this.repository.findOne({
            where: { user_id },
            order: { created_at: "DESC" },
        });
    }
}

export { ProgressInterviewRepository };
