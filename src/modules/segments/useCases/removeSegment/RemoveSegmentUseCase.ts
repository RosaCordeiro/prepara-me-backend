import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveSegmentUseCase {
    constructor(
        @inject("SegmentsRepository")
        private segmentsRepository: ISegmentsRepository
    ) {}

    async execute(id: string) {
        const subCount = await this.segmentsRepository.countSubsegments(id);
        if (subCount > 0) {
            throw new AppError(
                "Não é possível remover: há subsegmentos vinculados"
            );
        }

        const companyCount = await this.segmentsRepository.countCompanies(id);
        if (companyCount > 0) {
            throw new AppError(
                "Não é possível remover: há empresas vinculadas"
            );
        }

        await this.segmentsRepository.remove(id);
    }
}

export { RemoveSegmentUseCase };
