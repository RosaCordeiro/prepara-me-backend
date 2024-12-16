import { inject, injectable } from "tsyringe";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository"; // Importa o repositório
import { SurveyQuestion } from "@modules/company/infra/typeorm/entities/SurveyQuestions";

@injectable()
class GetSurveyQuestionUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: SurveyQuestionsRepository
    ) {}

    async execute(companyId: string): Promise<SurveyQuestion[]> {
        const surveyQuestions = await this.surveyQuestionsRepository.listByCompanyId(companyId);

        if (surveyQuestions.length === 0) {
            throw new Error("No survey questions found for this company");
        }

        return surveyQuestions;
    }
}

export { GetSurveyQuestionUseCase };