import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { Company } from "@modules/company/infra/typeorm/entities/Company";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class AcceptCompanyEmployeeUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute(id: string): Promise<boolean> {
        if (!id) {
            throw new AppError("Id is required!");
        }

        try {
            return await this.companyEmployeesRepository.accept(id);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export { AcceptCompanyEmployeeUseCase };

