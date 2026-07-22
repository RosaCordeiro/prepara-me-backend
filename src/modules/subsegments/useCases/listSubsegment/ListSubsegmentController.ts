import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSubsegmentUseCase } from "./ListSubsegmentUseCase";

class ListSubsegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, segmentId } = request.query;
        const { id } = request.params;
        const listSubsegmentUseCase = container.resolve(ListSubsegmentUseCase);
        const subsegments = await listSubsegmentUseCase.execute({
            name: name as string,
            segmentId: segmentId as string,
            id,
        });
        return response.status(200).send(subsegments);
    }
}

export { ListSubsegmentController };
