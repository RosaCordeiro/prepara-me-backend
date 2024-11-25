import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetSurveyQuestionUseCase } from "./getSurveyQuestionUseCase";

class GetSurveyQuestionController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params; 

        const getSurveyQuestionUseCase = container.resolve(GetSurveyQuestionUseCase);

        try {
            const surveyQuestion = await getSurveyQuestionUseCase.execute(id); 

            if (!surveyQuestion) {
                return response.status(404).json({ message: "Survey question not found" }); 
            }

            return response.status(200).json(surveyQuestion);
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

export { GetSurveyQuestionController };
