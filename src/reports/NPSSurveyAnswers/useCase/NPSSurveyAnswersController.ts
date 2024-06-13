import { Request, Response } from "express";
import { NPSSurveyAnswersUseCase } from "./NPSSurveyAnswersUseCase";

class NPSSurveyAnswersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId, area, role, period, unity, subarea, level } =
            request.query;

        let npsSurveyAnswersUseCaseNew = new NPSSurveyAnswersUseCase();

        const results = await npsSurveyAnswersUseCaseNew.execute({
            companyId,
            area,
            role,
            period,
            unity,
            subarea,
            level,
        });

        return response.status(200).send(results);
    }
}

export { NPSSurveyAnswersController };
