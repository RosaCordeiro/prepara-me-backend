import { ICreateSurveyQuestionDTO } from "../dtos/ICreateSurveyQuestionDTO";
import { SurveyQuestion } from "../infra/typeorm/entities/SurveyQuestions";

interface IRequestFind {
    id?: string;
    companyId?: string;
    questionText?: string;
}

interface ISurveyQuestionsRepository {
    create(data: ICreateSurveyQuestionDTO): Promise<SurveyQuestion>;
    findById(id: string): Promise<SurveyQuestion>;
    find(data: IRequestFind): Promise<SurveyQuestion[]>;
    findAll(): Promise<SurveyQuestion[]>;
    remove(id: string): Promise<void>;
}

export { ISurveyQuestionsRepository };
