import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { inject, injectable } from "tsyringe";

type ListCompanyEmployeeRequest = {
    name?: any;
    documentId?: any;
    userId?: any;
    notUserId?: any;
    phone?: any;
    email?: any;
    companyId?: any;
    id?: any;
    department?: any;
    dismissalType?: any;
    companyName?: any;
    openToWork?: any;
    segmentId?: any;
    subsegmentId?: any;
    position?: any;
    city?: any;
    state?: any;
    excludeCompanyId?: any;
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
        segmentId,
        subsegmentId,
        position,
        city,
        state,
        excludeCompanyId,
    }: ListCompanyEmployeeRequest) {
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
            dismissalType,
            companyName,
            openToWork: openToWork === true || openToWork === "true",
            segmentId,
            subsegmentId,
            position,
            city,
            state,
            excludeCompanyId,
        });

        console.log("companyEmployees", companyEmployees);

        return companyEmployees;
    }
}
export { ListCompanyEmployeeUseCase };
