import { ICompanyEmployeeResponseDTO } from "../dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "../dtos/ICreateCompanyEmployeeDTO";
import { IGetParametersResponseDTO } from "../dtos/IGetParametersResponseDTO";
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
}

interface ICompanyEmployeesRepository {
    create(data: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee>;
    find(data: IRequestFind): Promise<ICompanyEmployeeResponseDTO[]>;
    findById(id: string): Promise<CompanyEmployee>;
    remove(id: string): Promise<string>;
    accept(id: string): Promise<boolean>;
    realocate(id: string): Promise<boolean>;
    getParameters(
        id: string,
        period?: any,
        unity?: any,
        area?: any,
        subarea?: any,
        level?: any
    ): Promise<IGetParametersResponseDTO>;
}

export { ICompanyEmployeesRepository };
