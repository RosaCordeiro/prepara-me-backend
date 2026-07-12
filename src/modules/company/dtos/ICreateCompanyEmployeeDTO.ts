import { DismissalTypeEnum } from "@modules/company/enums/DismissalTypeEnum";

interface ICreateCompanyEmployeeDTO {
    name: string;
    companyId: string;
    documentId?: string;
    email?: string;
    phone?: string;
    userId?: string;
    subscribeToken: string;
    id?: string;
    easyRegister?: string;
    accepted?: boolean;
    realocate?: boolean;
    entryDate?: Date;
    position?: string;
    department?: string;
    plan?: string;
    unity?: string;
    packageDeclined?: boolean;
    dismissalType?: DismissalTypeEnum;
    gender?: string;
    etnia?: string;
    pcd?: boolean;
    city?: string;
    state?: string;
    linkedinUrl?: string;
    showLinkedinInRelocationProgram?: boolean;
}

export { ICreateCompanyEmployeeDTO };
