interface ICreateCompanyDTO {
    name: string;
    id?: string;
    segmentId?: string | null;
    subsegmentId?: string | null;
}

export { ICreateCompanyDTO };
