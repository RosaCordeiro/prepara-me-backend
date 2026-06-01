import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserSurveyFieldsUseCase } from "./UpdateUserSurveyFieldsUseCase";

class UpdateUserSurveyFieldsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const {
            NPSSurvey,
            laborRisk,
            surveyAnswered,
            feelingsMapJSON,
            brandRisk,
            laborRiskJSON,
            brandRiskJSON,
            surveyQuestion,
        } = request.body;

        const updateUserSurveyFieldsUseCase = container.resolve(
            UpdateUserSurveyFieldsUseCase
        );

        await updateUserSurveyFieldsUseCase.execute({
            user_id: id,
            laborRisk,
            NPSSurvey,
            surveyAnswered,
            feelingsMapJSON,
            brandRisk,
            laborRiskJSON,
            brandRiskJSON,
            surveyQuestion
        });

        return response.status(204).send();
    }
}

export { UpdateUserSurveyFieldsController };

