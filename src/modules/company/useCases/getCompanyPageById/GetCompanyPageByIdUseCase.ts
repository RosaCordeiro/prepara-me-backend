import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyPageRepository } from "@modules/company/repositories/ICompanyPageRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetCompanyPageByIdUseCase {
    constructor(
        @inject("CompanyPageRepository")
        private companyPageRepository: ICompanyPageRepository,
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository
    ) {}

    async execute(id: string) {
        if (id === undefined || id === null || id === "") {
            throw new Error("Id is required");
        }

        const company = await this.companyPageRepository.findByCompanyId(id);

        if (company === undefined || company === null) {
            throw new AppError("Página não encontrada");
        }

        const remainingVacancies = await this.companiesRepository.listVacancies(
            company.name
        );

        return {
            ...company,
            logo: `${process.env.AWS_BUCKET_URL}/company/${company.logo}`,
            logoInternal:
                company.logoInternal !== null
                    ? `${process.env.AWS_BUCKET_URL}/company/${company.logoInternal}`
                    : null,
            remainingVacancies: company.vacancies - remainingVacancies,
            expired: new Date() > company.expirationDate,
            expirationDate: company.expirationDate
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/"),
        };
    }
}

export { GetCompanyPageByIdUseCase };
