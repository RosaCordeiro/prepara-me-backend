import { IResponseMentoringDTO } from "@modules/mentoring/dtos/IResponseMentoringDTO";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

import {
    MentoringRepository,
    Pagination,
} from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class ListMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(
        page: number,
        limit: number,
        idUser: string
    ): Promise<Pagination> {
        const mentoring = await this.mentoringRepository.paginate(
            page,
            limit,
            idUser
        );

        mentoring.data.forEach((mentoring) => {
            mentoring.image = `${process.env.AWS_BUCKET_URL}/mentoring/${mentoring.image}`;
            return mentoring;
        });

        return mentoring;
    }
}

export { ListMentoringUseCase };

