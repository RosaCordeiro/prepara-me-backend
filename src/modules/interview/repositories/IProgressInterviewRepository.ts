import { ISaveProgressInterviewDTO } from "../dtos/ISaveProgressInterviewDTO";
import { ProgressInterview } from "../infra/typeorm/entities/ProgressInterview";

interface IProgressInterviewRepository {
    saveProgress(data: ISaveProgressInterviewDTO): Promise<ProgressInterview>;
    getProgressInterviewByUserId(user_id: string): Promise<ProgressInterview>;
}

export { IProgressInterviewRepository };
