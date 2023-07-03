import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class GetMentoringByIdUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(id: string): Promise<Mentoring> {
        if (!id) {
            throw new AppError("Id is not provided!");
        }

        const mentoring = await this.mentoringRepository.findById(id);

        mentoring.image = `${process.env.AWS_BUCKET_URL}/mentoring/${mentoring.image}`;

        return mentoring;
    }
}

export { GetMentoringByIdUseCase };

