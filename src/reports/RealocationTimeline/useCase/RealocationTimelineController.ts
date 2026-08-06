import { Request, Response } from "express";
import { RealocationTimelineUseCase } from "./RealocationTimelineUseCase";

class RealocationTimelineController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { companyId } = request.query;
        const useCase = new RealocationTimelineUseCase();

        const results = await useCase.execute(
            companyId !== undefined ? String(companyId) : undefined
        );

        return response.status(200).send(results);
    }
}

export { RealocationTimelineController };
