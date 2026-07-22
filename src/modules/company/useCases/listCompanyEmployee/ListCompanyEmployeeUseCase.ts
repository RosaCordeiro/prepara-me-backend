import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { inject, injectable } from "tsyringe";

type ListCompanyEmployeeInput = {
    name?: string;
    documentId?: string;
    userId?: string;
    notUserId?: string;
    phone?: string;
    email?: string;
    companyId?: string;
    id?: string;
    department?: string;
    dismissalType?: string;
    companyName?: string;
    openToWork?: boolean | string;
    position?: string;
    city?: string;
    state?: string;
    excludeCompanyId?: string;
};

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
        department,
        dismissalType,
        companyName,
        openToWork,
        position,
        city,
        state,
        excludeCompanyId,
    }: ListCompanyEmployeeInput) {
        const companyEmployees = await this.companyEmployeesRepository.find({
            name,
            documentId,
            userId,
            notUserId,
            phone,
            email,
            companyId,
            id,
            department,
            dismissalType: dismissalType as any,
            companyName,
            openToWork: openToWork === true || openToWork === "true",
            position,
            city,
            state,
            excludeCompanyId,
        });

        return companyEmployees;
    }
}
export { ListCompanyEmployeeUseCase };
