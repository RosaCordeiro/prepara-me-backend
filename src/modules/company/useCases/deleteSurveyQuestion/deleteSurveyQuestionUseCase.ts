import { inject, injectable } from "tsyringe";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository"; // Importa o repositório
import { AppError } from "@shared/errors/AppError";

@injectable()
class DeleteSurveyQuestionUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: SurveyQuestionsRepository 
    ) {}

    async execute(id: string) {
        await this.surveyQuestionsRepository.deleteById(id);
    }
}

export { DeleteSurveyQuestionUseCase };
