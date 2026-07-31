import { DismissalTypeEnum } from "@modules/company/enums/DismissalTypeEnum";

interface IUpdateCompanyEmployeeDTO {
    id: string;
    name?: string;
    documentId?: string;
    email?: string;
    phone?: string;
    entryDate?: Date;
    position?: string;
    department?: string;
    plan?: string;
    unity?: string;
    dismissalType?: DismissalTypeEnum;
    gender?: string;
    etnia?: string;
    pcd?: boolean;
    city?: string;
    state?: string;
    linkedinUrl?: string;
    showLinkedinInRelocationProgram?: boolean;
}

export { IUpdateCompanyEmployeeDTO };