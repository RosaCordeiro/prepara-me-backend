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
        return this.surveyQuestionsRepository.listByCompanyId(companyId);
    }
}

export { GetSurveyQuestionUseCase };