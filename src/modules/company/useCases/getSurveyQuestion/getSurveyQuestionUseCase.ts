import { inject, injectable } from "tsyringe";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository"; // Importa o repositório
import { AppError } from "@shared/errors/AppError";

@injectable()
class GetSurveyQuestionUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: SurveyQuestionsRepository // Injeta o repositório
    ) {}

    async execute(id: string) {
        const surveyQuestion = await this.surveyQuestionsRepository.findById(id);
        return surveyQuestion;
    }
}

export { GetSurveyQuestionUseCase };
