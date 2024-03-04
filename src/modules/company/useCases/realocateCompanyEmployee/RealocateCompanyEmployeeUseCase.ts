import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { Company } from "@modules/company/infra/typeorm/entities/Company";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RealocateCompanyEmployeeUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(id: string): Promise<boolean> {
        if (!id) {
            throw new AppError("Id is required!");
        }

        try {
            await this.companyEmployeesRepository.realocate(id);
            const companyEmployee =
                await this.companyEmployeesRepository.findById(id);

            if (!companyEmployee) {
                throw new AppError("Company employee not found!");
            }

            await this.usersRepository.create({
                ...companyEmployee.user,
                realocated: UserRealocatedEnum.REALOCATED,
            });

            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export { RealocateCompanyEmployeeUseCase };
