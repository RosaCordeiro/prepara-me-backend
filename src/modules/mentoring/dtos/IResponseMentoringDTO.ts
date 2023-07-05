import { Specialist } from "@modules/specialists/infra/typeorm/entities/Specialist";

interface IResponseMentoringDTO {
    id?: string;
    title: string;
    date: string;
    mentorId: Specialist;
    linkMeet: string;
    vacancies: number;
    users: number;
    image: string;
    eventId?: string;
    usersMentoring?: any[];
}

export { IResponseMentoringDTO };

