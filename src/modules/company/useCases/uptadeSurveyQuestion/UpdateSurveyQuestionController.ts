import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateSurveyQuestionUseCase } from "./UpdateSurveyQuestionUseCase";

class UpdateSurveyQuestionController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { questionText } = request.body;

        const updateSurveyQuestionUseCase = container.resolve(UpdateSurveyQuestionUseCase);

        await updateSurveyQuestionUseCase.execute({ id, questionText });

        return response.status(201).json({ message: "Survey question updated successfully." });
    }
}

export { UpdateSurveyQuestionController };
