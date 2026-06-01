import { inject, injectable } from "tsyringe";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository"; // Importa o repositório
import { SurveyQuestion } from "@modules/company/infra/typeorm/entities/SurveyQuestions";

@injectable()
class GetSurveyQuestionByIdUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: SurveyQuestionsRepository
    ) {}

    async execute(id: string): Promise<SurveyQuestion> {
        const surveyQuestions = await this.surveyQuestionsRepository.findById(id);

        if (!surveyQuestions) {
            throw new Error("No survey questions found for this company");
        }

        return surveyQuestions;
    }
}

export { GetSurveyQuestionByIdUseCase };