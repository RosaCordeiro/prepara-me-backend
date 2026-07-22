import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveSubsegmentUseCase {
    constructor(
        @inject("SubsegmentsRepository")
        private subsegmentsRepository: ISubsegmentsRepository
    ) {}

    async execute(id: string) {
        const companyCount = await this.subsegmentsRepository.countCompanies(
            id
        );
        if (companyCount > 0) {
            throw new AppError(
                "Não é possível remover: há empresas vinculadas"
            );
        }
        await this.subsegmentsRepository.remove(id);
    }
}

export { RemoveSubsegmentUseCase };
