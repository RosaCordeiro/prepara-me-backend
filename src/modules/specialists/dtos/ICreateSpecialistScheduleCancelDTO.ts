interface ICreateSpecialistScheduleCancelDTO {
    dateSchedule: Date;
    specialistId: string;
    userId: string;
    productId: string;
    id?: string;
    reason: string;
}

export { ICreateSpecialistScheduleCancelDTO };
