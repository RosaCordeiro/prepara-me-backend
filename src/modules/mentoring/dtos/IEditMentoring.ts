interface IEditMentoringDTO {
    id?: string;
    title: string;
    date: Date;
    mentor: string;
    image: string;
    file?: string;
    usersMentoring?: any[];
}

export { IEditMentoringDTO };

