import { Request, Response } from "express";
import { container } from "tsyringe";
import { EditMentoringUseCase } from "./EditMentoringUseCase";

class EditMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        const editMentoringUseCase = container.resolve(EditMentoringUseCase);

        const { mentoringId } = request.params;

        const body = request.body;
        const files: any = request.files;

        if (request.files !== undefined && files.length > 0) {
            body.file = request.files[0].filename;
        }

        await editMentoringUseCase.execute(mentoringId, body);

        return response.status(200).json({
            message: "Mentoring updated",
        });
    }
}

export { EditMentoringController };

