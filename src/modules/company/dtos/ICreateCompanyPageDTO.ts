interface ICreateCompanyPageDTO {
    id?: string;
    name: string;
    vacancies: number;
    expirationDate: Date;
    logo?: string;
    logoInternal?: string;
    text: string;
    companyId: string;
    backgroundColor?: string;
    containerColor?: string;
    clockColor?: string;
    textColor?: string;
    active?: boolean;
}

export { ICreateCompanyPageDTO };
