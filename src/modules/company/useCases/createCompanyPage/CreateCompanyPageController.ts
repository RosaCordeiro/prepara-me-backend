import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCompanyPageUseCase } from "./CreateCompanyPageUseCase";

class CreateCompanyPageController {
    async handle(request: Request, response: Response): Promise<Response> {
        const body = request.body;

        const createCompanyPageUseCase = container.resolve(
            CreateCompanyPageUseCase
        );

        if (!body.id || body.id === "") {
            if (
                request.files === undefined ||
                request.files.length === 0 ||
                request.files[0]?.fieldname !== "logo"
            ) {
                return response.status(400).json("Logo is required");
            }
        }

        if (
            request.files !== undefined &&
            request.files[0]?.fieldname === "logo"
        ) {
            if (request.files.length !== 0) {
                body.logo = request.files[0].filename;
            }
        } else {
            body.logo = "";
        }

        const company = await createCompanyPageUseCase.execute(request.body);

        return response.status(201).send(company);
    }
}

export { CreateCompanyPageController };
