import { IResponseMentoringDTO } from "@modules/mentoring/dtos/IResponseMentoringDTO";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

import {
    MentoringRepository,
    Pagination,
} from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class ListMentoringScheduleUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository
    ) {}

    async execute(
        userId: string,
        dateBegin: string,
        dateEnd: string
    ): Promise<any> {
        if (!userId || userId === "undefined") {
            throw new AppError("User id is not provided!");
        }

        if (!dateBegin || dateBegin === "undefined") {
            throw new AppError("Date begin is not provided!");
        }

        if (!dateEnd || dateEnd === "undefined") {
            throw new AppError("Date end is not provided!");
        }

        return {
            data: "Teste",
        };
    }
}

export { ListMentoringScheduleUseCase };

