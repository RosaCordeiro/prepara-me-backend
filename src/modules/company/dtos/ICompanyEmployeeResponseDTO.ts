import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { Company } from "../infra/typeorm/entities/Company";

interface ICompanyEmployeeResponseDTO {
    id: string;
    company: Company;
    name: string;
    documentId: string;
    subscribeToken: string;
    phone: string;
    email: string;
    user: IUserResponseDTO;
    easyRegister: Object;
    accepted: boolean;
    entryDate: Date;
    position: string;
    department: string;
    plan: string;
    unity: string;
    planId?: any;
    packageDeclined: boolean;
    subarea: string;
    level: string;
}

export { ICompanyEmployeeResponseDTO };
