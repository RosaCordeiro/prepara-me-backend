import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyPageRepository } from "@modules/company/repositories/ICompanyPageRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetCompanyPageByNameUseCase {
    constructor(
        @inject("CompanyPageRepository")
        private companyPageRepository: ICompanyPageRepository,
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository
    ) {}

    async execute(name: string) {
        if (name === undefined || name === null || name === "") {
            throw new Error("Name is required");
        }

        const company = await this.companyPageRepository.findByName(name);

        if (company === undefined || company === null) {
            throw new AppError("Company not found");
        }

        const remainingVacancies = await this.companiesRepository.listVacancies(
            name
        );

        return {
            ...company,
            logoUrl: `${process.env.AWS_BUCKET_URL}/company/${company.logo}`,
            remainingVacancies: company.vacancies - remainingVacancies,
            expired: new Date() > new Date(company.expirationDate),
        };
    }
}

export { GetCompanyPageByNameUseCase };
