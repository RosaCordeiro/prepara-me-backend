import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ListVacanciesUseCase {
    constructor(
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository
    ) {}

    async execute(companyName: string) {
        3;
        if (
            companyName === undefined ||
            companyName === null ||
            companyName === "" ||
            companyName === " "
        ) {
            throw new AppError("Company name is required!");
        }

        if (companyName !== "apsen") {
            throw new AppError("Company not found!");
        }

        const count = await this.companiesRepository.listVacancies(companyName);

        return count;
    }
}

export { ListVacanciesUseCase };
