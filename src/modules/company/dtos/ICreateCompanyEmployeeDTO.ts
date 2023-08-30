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
}

export { ICreateCompanyEmployeeDTO };
