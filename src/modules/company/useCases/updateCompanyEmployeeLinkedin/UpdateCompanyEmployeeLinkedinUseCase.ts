import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
    id: string;
    requesterUserId: string;
    linkedinUrl?: string;
    showLinkedinInRelocationProgram?: boolean;
}

@injectable()
class UpdateCompanyEmployeeLinkedinUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        id,
        requesterUserId,
        linkedinUrl,
        showLinkedinInRelocationProgram,
    }: IRequest) {
        const requester = await this.usersRepository.findById(requesterUserId);

        if (!requester) {
            throw new AppError("Usuário não encontrado", 401);
        }

        const employee = await this.companyEmployeesRepository.findById(id);

        if (!employee) {
            throw new AppError("Colaborador não encontrado", 404);
        }

        const isAdmin = requester.type === UserTypeEnum.ADMIN;
        const isOwner = employee.userId === requesterUserId;
        const isCompanyAdminOfEmployee =
            requester.type === UserTypeEnum.COMPANY_ADMIN &&
            !!requester.companyId &&
            employee.companyId === requester.companyId;

        if (!isAdmin && !isOwner && !isCompanyAdminOfEmployee) {
            throw new AppError("Sem permissão para alterar este colaborador", 403);
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
