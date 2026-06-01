import { inject, injectable } from "tsyringe";
import { ISurveyQuestionsRepository } from "@modules/company/repositories/ISurveyQuestionsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    id: string;
    questionText: string;
}

@injectable()
class UpdateSurveyQuestionUseCase {
    constructor(
        @inject("SurveyQuestionsRepository")
        private surveyQuestionsRepository: ISurveyQuestionsRepository
    ) {}

    async execute({ id, questionText }: IRequest): Promise<void> {
        
        const surveyQuestion = await this.surveyQuestionsRepository.findById(id);

        if (!surveyQuestion) {
            throw new AppError("Survey Question not found", 404);
        }

        surveyQuestion.questionText = questionText;

        await this.surveyQuestionsRepository.update(surveyQuestion);
    }
}

export { UpdateSurveyQuestionUseCase };
