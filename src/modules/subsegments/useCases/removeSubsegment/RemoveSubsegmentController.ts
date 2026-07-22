import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveSubsegmentUseCase } from "./RemoveSubsegmentUseCase";

class RemoveSubsegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const removeSubsegmentUseCase = container.resolve(
            RemoveSubsegmentUseCase
        );
        await removeSubsegmentUseCase.execute(id);
        return response.status(200).send();
    }
}

export { RemoveSubsegmentController };
