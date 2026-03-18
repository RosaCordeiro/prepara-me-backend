import { ICompanyEmployeeResponseDTO } from "../dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "../dtos/ICreateCompanyEmployeeDTO";
import { IUpdateCompanyEmployeeDTO } from "../dtos/IUpdateCompanyEmployeeDTO";
import { IGetParametersResponseDTO } from "../dtos/IGetParametersResponseDTO";
import { DismissalTypeEnum } from "../enums/DismissalTypeEnum";
import { CompanyEmployee } from "../infra/typeorm/entities/CompanyEmployee";

interface IRequestFind {
    companyId?: string;
    name?: string;
    documentId?: string;
    notUserId?: string;
    userId?: string;
    phone?: string;
    email?: string;
    id?: string;
    department?: string;
    dismissalType?: DismissalTypeEnum;
}

interface ICompanyEmployeesRepository {
    create(data: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee>;
    update(data: IUpdateCompanyEmployeeDTO): Promise<CompanyEmployee>;
    find(data: IRequestFind): Promise<ICompanyEmployeeResponseDTO[]>;
    findById(id: string): Promise<CompanyEmployee>;
    remove(id: string): Promise<string>;
    accept(id: string): Promise<boolean>;
    realocate(id: string, manualCompany: string): Promise<boolean>;
    getParameters(
        id: string,
        period?: any,
        unity?: any,
        area?: any,
        dismissalType?: any
    ): Promise<IGetParametersResponseDTO>;
}

export { ICompanyEmployeesRepository };
