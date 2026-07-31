import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
    userId: string;
    linkedinUrl?: string;
    showLinkedinInRelocationProgram?: boolean;
}

@injectable()
class UpdateMyCompanyEmployeeProfileUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute({
        userId,
        linkedinUrl,
        showLinkedinInRelocationProgram,
    }: IRequest) {
        const employees = await this.companyEmployeesRepository.find({
            userId,
        });

        if (!employees.length) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        const employee = employees[0];

        await this.companyEmployeesRepository.update({
            id: employee.id,
            linkedinUrl,
            showLinkedinInRelocationProgram,
        });

        const updatedEmployees = await this.companyEmployeesRepository.find({
            id: employee.id,
        });

        if (!updatedEmployees.length) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        return updatedEmployees[0];
    }
}

export { UpdateMyCompanyEmployeeProfileUseCase };
