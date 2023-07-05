import { IResponseMentoringDTO } from "@modules/mentoring/dtos/IResponseMentoringDTO";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { AppError } from "@shared/errors/AppError";
import { formatDateTimeLocal } from "@utils/formatDate";

import { inject, injectable } from "tsyringe";

@injectable()
class GetMentoringByIdUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(id: string): Promise<IResponseMentoringDTO> {
        if (!id) {
            throw new AppError("Id is not provided!");
        }

        const mentoring = await this.mentoringRepository.findById(id);

        if (!mentoring) {
            throw new AppError("Mentoring not found!");
        }

        console.log(mentoring);

        return {
            id: mentoring.id,
            title: mentoring.title,
            image: `${process.env.AWS_BUCKET_URL}/mentoring/${mentoring.image}`,
            date: formatDateTimeLocal(mentoring.date),
            linkMeet: mentoring.linkMeet,
            mentorId: mentoring.mentor,
            users: mentoring.users,
            vacancies: mentoring.vacancies,
            eventId: mentoring.eventId,
            usersMentoring: mentoring.usersMentoring,
        };
    }
}

export { GetMentoringByIdUseCase };

