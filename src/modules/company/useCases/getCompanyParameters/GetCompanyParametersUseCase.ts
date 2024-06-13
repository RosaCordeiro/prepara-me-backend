import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetCompanyParametersUseCase {
    constructor(
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository,
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute(
        id: string,
        period?: any,
        unity?: any,
        area?: any,
        subarea?: any,
        level?: any
    ) {
        if (!id) {
            throw new AppError("Invalid id");
        }

        if (id !== "TUDO" && id !== "B2B" && id !== "B2C") {
            const company = await this.companiesRepository.findById(id);

            if (!company) {
                throw new AppError("Company not found");
            }
        }

        return await this.companyEmployeesRepository.getParameters(
            id,
            period,
            unity,
            area,
            subarea,
            level
        );
    }
}

export { GetCompanyParametersUseCase };
