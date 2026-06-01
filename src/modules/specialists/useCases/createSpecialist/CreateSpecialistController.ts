import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistUseCase } from "./CreateSpecialistUseCase";

class CreateSpecialistController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, bio, userId, status, linkedinUrl, id } = request.body;

        const createSpecialistUseCase = container.resolve(
            CreateSpecialistUseCase
        );

        console.log(request.files);

        let image = undefined;

        if (
            request.files !== undefined &&
            request.files[0]?.fieldname === "image"
        ) {
            image = request.files[0].filename;
        }

        const specialist = await createSpecialistUseCase.execute({
            name,
            bio,
            userId,
            status,
            linkedinUrl,
            id,
            image,
        });

        return response.status(201).json(specialist);
    }
}

export { CreateSpecialistController };
