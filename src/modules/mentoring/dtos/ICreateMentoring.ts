interface ICreateMentoringDTO {
    id?: string;
    title: string;
    date: Date;
    mentor: string;
    linkMeet: string;
    eventId: string;
    vacancies: number;
    users: number;
    image: string;
}

export { ICreateMentoringDTO };

