import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetSurveyQuestionByIdUseCase } from "./getSurveyQuestionByIdUseCase";


class GetSurveyQuestionByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const getSurveyQuestionUseCase = container.resolve(GetSurveyQuestionByIdUseCase);

        try {
            const surveyQuestions = await getSurveyQuestionUseCase.execute(id as string);

            return response.status(200).json(surveyQuestions);
        } catch (error) {
            return response.status(404).json({ message: error.message });
        }
    }
}

export { GetSurveyQuestionByIdController }
