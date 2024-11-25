import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteSurveyQuestionUseCase } from "./deleteSurveyQuestionUseCase";

class DeleteSurveyQuestionController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteSurveyQuestionUseCase = container.resolve(DeleteSurveyQuestionUseCase);

        await deleteSurveyQuestionUseCase.execute(id);

        return response.status(204).send();
    }
}

export { DeleteSurveyQuestionController };
