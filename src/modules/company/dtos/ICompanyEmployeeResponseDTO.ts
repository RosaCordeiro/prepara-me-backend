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
}

export { ICompanyEmployeeResponseDTO };

