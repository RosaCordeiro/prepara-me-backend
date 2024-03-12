import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMaterialUseCase } from "./CreateMaterialUseCase";

class CreateMaterialController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createMaterialUseCase = container.resolve(CreateMaterialUseCase);

        if (!request.body.id || request.body.id === "") {
            console.log(request.body.id);

            if (
                request.files === undefined ||
                request.files.length === 0 ||
                request.files[0]?.fieldname !== "file"
            ) {
                return response.status(400).json("File is required");
            }

            const createMentoring = await createMaterialUseCase.execute(
                request.body,
                request.files[0].filename
            );

            return response.status(201).json(createMentoring);
        } else {
            const body = request.body;
            const files: any = request.files;
            let file: any = undefined;

            if (request.files !== undefined && files.length > 0) {
                file = files[0].filename;
            }

            await createMaterialUseCase.execute(body, file);

            return response.status(201).json({
                message: "Mentoring updated",
            });
        }
    }
}

export { CreateMaterialController };
