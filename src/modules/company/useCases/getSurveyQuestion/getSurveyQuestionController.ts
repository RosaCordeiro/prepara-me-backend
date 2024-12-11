import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetSurveyQuestionUseCase } from "./getSurveyQuestionUseCase";


class GetSurveyQuestionController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId } = request.query;
        const getSurveyQuestionUseCase = container.resolve(GetSurveyQuestionUseCase);

        try {
            const surveyQuestions = await getSurveyQuestionUseCase.execute(`${companyId}`);

            return response.status(200).json(surveyQuestions);
        } catch (error) {
            return response.status(404).json({ message: error.message });
        }
    }
}

export { GetSurveyQuestionController }
