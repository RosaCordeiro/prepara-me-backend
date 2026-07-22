import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveSegmentUseCase } from "./RemoveSegmentUseCase";

class RemoveSegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const removeSegmentUseCase = container.resolve(RemoveSegmentUseCase);
        await removeSegmentUseCase.execute(id);
        return response.status(200).send();
    }
}

export { RemoveSegmentController };
