import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMentoringUseCase } from "./CreateMentoringUseCase";
import { EditMentoringUseCase } from "../editMentoring/EditMentoringUseCase";

class CreateMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createMentoringUseCase = container.resolve(
            CreateMentoringUseCase
        );

        const editMentoringUseCase = container.resolve(EditMentoringUseCase);

        if (!request.body.id || request.body.id === "") {
            console.log("create");
            if (
                request.files === undefined ||
                request.files.length === 0 ||
                request.files[0]?.fieldname !== "image"
            ) {
                return response.status(400).json("Image is required");
            }

            const createMentoring = await createMentoringUseCase.execute(
                request.body,
                request.files[0].filename
            );

            return response.status(201).json(createMentoring);
        } else {
            const { id } = request.body;

            const body = request.body;
            const files: any = request.files;

            if (request.files !== undefined && files.length > 0) {
                body.file = request.files[0].filename;
            }

            await editMentoringUseCase.execute(id, body);

            return response.status(201).json({
                message: "Mentoring updated",
            });
        }
    }
}

export { CreateMentoringController };

