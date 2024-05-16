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
}

export { ICreateCompanyEmployeeDTO };
