interface IResponseMentoringDTO {
    id?: string;
    title: string;
    date: string;
    mentor: string;
    linkMeet: string;
    vacancies: number;
    users: number;
    image: string;
    eventId?: string;
    usersMentoring?: any[];
}

export { IResponseMentoringDTO };

