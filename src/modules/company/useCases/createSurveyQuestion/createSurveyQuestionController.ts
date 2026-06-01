import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSurveyQuestionUseCase } from "./createSurveyQuestionUseCase";

class CreateSurveyQuestionController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId, questionText } = request.body;

        const createSurveyQuestionUseCase = container.resolve(CreateSurveyQuestionUseCase);

        const surveyQuestion = await createSurveyQuestionUseCase.execute({
            companyId,
            questionText,
        });

        return response.status(201).json(surveyQuestion);
    }
}

export { CreateSurveyQuestionController };
