import { getRepository, Repository } from "typeorm";
import { SurveyQuestion } from "../entities/SurveyQuestions";
import { ISurveyQuestionsRepository } from "@modules/company/repositories/ISurveyQuestionsRepository";
import { ICreateSurveyQuestionDTO } from "@modules/company/dtos/ICreateSurveyQuestionDTO";
import { AppError } from "@shared/errors/AppError";

interface IRequestFind { // Definição temporária de interface para o metodo de busca
    companyId?: string;
    id?: string;
    questionText?: string;
}

class SurveyQuestionsRepository implements ISurveyQuestionsRepository {
    private repository: Repository<SurveyQuestion>;

    constructor() {
        this.repository = getRepository(SurveyQuestion);
    }
    find(data: IRequestFind): Promise<SurveyQuestion[]> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<SurveyQuestion[]> {
        throw new Error("Method not implemented.");
    }
    remove(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async create({ companyId, questionText }: ICreateSurveyQuestionDTO): Promise<SurveyQuestion> {
        const surveyQuestion = this.repository.create({ companyId, questionText });
        await this.repository.save(surveyQuestion);
        return surveyQuestion;
    }

    async findById(id: string): Promise<SurveyQuestion> {
        const surveyQuestion = await this.repository.findOne({
            where: {
                id: id, 
            }
        });

        if (!surveyQuestion) {
            throw new AppError("Survey Question not found", 404);
        }

        return surveyQuestion;
    }

    async update(surveyQuestion: SurveyQuestion): Promise<SurveyQuestion> {
        return this.repository.save(surveyQuestion);
    }    

    async listByCompanyId(companyId: string): Promise<SurveyQuestion[]> {
        return this.repository.find({ where: { companyId } });
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.repository.delete(id);

        if (result.affected === 0) {
            throw new AppError("Survey Question not found", 404);
        }
    }
}

export { SurveyQuestionsRepository };
