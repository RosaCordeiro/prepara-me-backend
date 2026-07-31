import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSubsegmentUseCase } from "./CreateSubsegmentUseCase";

class CreateSubsegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, segmentId, id } = request.body;
        const createSubsegmentUseCase = container.resolve(
            CreateSubsegmentUseCase
        );
        const subsegment = await createSubsegmentUseCase.execute({
            name,
            segmentId,
            id,
        });
        return response.status(201).send(subsegment);
    }
}

export { CreateSubsegmentController };
