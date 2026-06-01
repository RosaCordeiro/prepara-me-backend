import { inject, injectable } from "tsyringe";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository"; // Importa o repositório
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    companyId: string;
    questionText: string;
}

@injectable()
class CreateSurveyQuestionUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: SurveyQuestionsRepository
    ) {}

    async execute({ companyId, questionText }: IRequest) {
        if (!companyId) {
            throw new AppError("Company ID can't be null");
        }

        if (!questionText) {
            throw new AppError("Question text can't be null");
        }

        const surveyQuestion = await this.surveyQuestionsRepository.create({
            companyId,
            questionText,
        });

        return surveyQuestion;
    }
}

export { CreateSurveyQuestionUseCase };
