import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { IResponseProductDTO } from "@modules/products/dtos/IResponseProductDTO";
import { ISpecialistResponseDTO } from "./ISpecialistResponseDTO";

interface ISpecialistScheduleResponseDTO {
    id: string;
    comments: string;
    dateSchedule: Date;
    hangoutLink: string;
    scheduleEventId: string;
    product: IResponseProductDTO;
    productId: string;
    specialist: ISpecialistResponseDTO;
    specialistId: string;
    status: Object;
    user: IUserResponseDTO;
    userId: string;
    rating: number;
    filesCountUser: number;
    filesCountSpecialist: number;
}

export { ISpecialistScheduleResponseDTO };
