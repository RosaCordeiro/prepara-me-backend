import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMentoringUseCase } from "./CreateMentoringUseCase";

class CreateMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createMentoringUseCase = container.resolve(
            CreateMentoringUseCase
        );

        if (
            request.files === undefined ||
            request.files.length === 0 ||
            request.files[0]?.fieldname !== "image"
        ) {
            return response.status(400).json({ error: "Image is required" });
        }

        const createMentoring = await createMentoringUseCase.execute(
            request.body,
            request.files[0].filename
        );

        return response.status(201).json(createMentoring);
    }
}

export { CreateMentoringController };

