interface IEditMentoringDTO {
    id?: string;
    title: string;
    date: Date;
    mentorId: string;
    image: string;
    file?: string;
    usersMentoring?: any[];
}

export { IEditMentoringDTO };

