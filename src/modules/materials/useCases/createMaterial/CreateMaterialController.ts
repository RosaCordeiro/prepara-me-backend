import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMaterialUseCase } from "./CreateMaterialUseCase";

class CreateMaterialController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createMaterialUseCase = container.resolve(CreateMaterialUseCase);        
        if (!request.body.id || request.body.id === "") {
            console.log(request.body.id);

            const image = (request.files as Express.Multer.File[]).find(item => item.fieldname === "image");            
            
            if (
                image === undefined ||
                image === null
            ) {
                return response.status(400).json("Image is required");
            }

            const createMentoring = await createMaterialUseCase.execute(
                request.body,
                image.filename
            );

            return response.status(201).json(createMentoring);
        } else {
            const body = request.body;
            const files: any = request.files;
            let image: any = undefined;
            
            if (files) {
                image = files.find((item: any) => item.fieldname === "image");
            }

            await createMaterialUseCase.execute(body, image?.filename);

            return response.status(201).json({
                message: "Mentoring updated",
            });
        }
    }
}

export { CreateMaterialController };
