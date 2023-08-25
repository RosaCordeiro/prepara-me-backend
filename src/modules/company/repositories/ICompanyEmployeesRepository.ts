import { ICompanyEmployeeResponseDTO } from "../dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "../dtos/ICreateCompanyEmployeeDTO";
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
}

interface ICompanyEmployeesRepository {
    create(data: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee>;
    find(data: IRequestFind): Promise<ICompanyEmployeeResponseDTO[]>;
    remove(id: string): Promise<string>;
    accept(id: string): Promise<boolean>;
    realocate(id: string): Promise<boolean>;
}

export { ICompanyEmployeesRepository };
