import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListCompanyEmployeeUseCase {
    constructor(
        @inject("CompanyEmployeesRepository")
        private companyEmployeesRepository: ICompanyEmployeesRepository
    ) {}

    async execute({
        name,
        documentId,
        userId,
        notUserId,
        phone,
        email,
        companyId,
        id,
    }) {
        const companyEmployees = await this.companyEmployeesRepository.find({
            name,
            documentId,
            userId,
            notUserId,
            phone,
            email,
            companyId,
            id,
        });

        console.log("companyEmployees", companyEmployees);

        return companyEmployees;
    }
}
export { ListCompanyEmployeeUseCase };
