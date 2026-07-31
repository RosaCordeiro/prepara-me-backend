import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetMyCompanyEmployeeProfileUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute(userId: string) {
        const employees = await this.companyEmployeesRepository.find({
            userId,
        });

        if (!employees.length) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        return employees[0];
    }
}

export { GetMyCompanyEmployeeProfileUseCase };
