import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveCompanyEmployeeUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployees: ICompanyEmployeesRepository
    ) {}

    async execute(id) {
        const companyEmployees = await this.companyEmployees.find({ id });

        if (companyEmployees[0].user && companyEmployees[0].user.id) {
            throw new AppError("Can't remove a employee connected at a user");
        }

        return await this.companyEmployees.remove(id);
    }
}

export { RemoveCompanyEmployeeUseCase };

