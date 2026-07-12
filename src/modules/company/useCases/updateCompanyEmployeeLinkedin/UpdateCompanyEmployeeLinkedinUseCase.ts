import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
    id: string;
    linkedinUrl?: string;
    showLinkedinInRelocationProgram?: boolean;
}

@injectable()
class UpdateCompanyEmployeeLinkedinUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute({
        id,
        linkedinUrl,
        showLinkedinInRelocationProgram,
    }: IRequest) {
        const employee = await this.companyEmployeesRepository.findById(id);

        if (!employee) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        await this.companyEmployeesRepository.update({
            id,
            linkedinUrl,
            showLinkedinInRelocationProgram,
        });

        const employees = await this.companyEmployeesRepository.find({ id });

        if (!employees.length) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        return employees[0];
    }
}

export { UpdateCompanyEmployeeLinkedinUseCase };
