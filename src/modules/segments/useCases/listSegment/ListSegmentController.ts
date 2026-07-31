import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSegmentUseCase } from "./ListSegmentUseCase";

class ListSegmentController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.query;
        const { id } = request.params;
        const listSegmentUseCase = container.resolve(ListSegmentUseCase);
        const segments = await listSegmentUseCase.execute({
            name: name as string,
            id,
        });
        return response.status(200).send(segments);
    }
}

export { ListSegmentController };
