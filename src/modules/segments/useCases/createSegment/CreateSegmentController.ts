import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSegmentUseCase } from "./CreateSegmentUseCase";

class CreateSegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, id } = request.body;
        const createSegmentUseCase = container.resolve(CreateSegmentUseCase);
        const segment = await createSegmentUseCase.execute({ name, id });
        return response.status(201).send(segment);
    }
}

export { CreateSegmentController };
