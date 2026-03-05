import { Request, Response } from "express";
import { NPSSurveyAnswersUseCase } from "./NPSSurveyAnswersUseCase";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository";

class NPSSurveyAnswersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId, area, role, period, unity, dismissalType, gender, etnia, pcd, city, state } = request.query;

        const surveyQuestionsRepository = new SurveyQuestionsRepository();
        let npsSurveyAnswersUseCaseNew = new NPSSurveyAnswersUseCase(surveyQuestionsRepository);

        const results = await npsSurveyAnswersUseCaseNew.execute(
            {
                companyId,
                area,
                role,
                period,
                unity,
                dismissalType,
                gender,
                etnia,
                pcd,
                city,
                state,
            },
            request.user.id
        );

        return response.status(200).send(results);
    }
}

export { NPSSurveyAnswersController };
