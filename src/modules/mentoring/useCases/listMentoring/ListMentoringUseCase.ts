import { IResponseMentoringDTO } from "@modules/mentoring/dtos/IResponseMentoringDTO";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class ListMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(): Promise<Mentoring[]> {
        const mentoring = await this.mentoringRepository.find();

        const mentoringList = mentoring.map((mentoring) => {
            mentoring.image = `${process.env.AWS_BUCKET_URL}/mentoring/${mentoring.image}`;
            return mentoring;
        });

        return mentoringList;
    }
}

export { ListMentoringUseCase };

