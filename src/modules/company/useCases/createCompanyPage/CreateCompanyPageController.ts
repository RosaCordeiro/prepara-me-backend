import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCompanyPageUseCase } from "./CreateCompanyPageUseCase";

class CreateCompanyPageController {
    async handle(request: Request, response: Response): Promise<Response> {
        const body = request.body;

        const createCompanyPageUseCase = container.resolve(
            CreateCompanyPageUseCase
        );

        const files: any = request.files;

        if (!body.id || body.id === "") {
            if (
                files === undefined ||
                files.length === 0 ||
                files.findIndex((f: any) => f.fieldname === "logo") === -1
            ) {
                return response.status(400).json("Logo is required");
            }

            /* logoInternal */
            if (
                files === undefined ||
                files.length === 0 ||
                files.findIndex((f: any) => f.fieldname === "logoInternal") ===
                    -1
            ) {
                return response.status(400).json("Logo Internal is required");
            }
        }

        if (files !== undefined && files.length > 0) {
            if (files.findIndex((f: any) => f.fieldname === "logo") !== -1) {
                body.logo =
                    files[
                        files.findIndex((f: any) => f.fieldname === "logo")
                    ].filename;
            } else {
                body.logo = "";
            }

            if (
                files.findIndex((f: any) => f.fieldname === "logoInternal") !==
                -1
            ) {
                body.logoInternal =
                    files[
                        files.findIndex(
                            (f: any) => f.fieldname === "logoInternal"
                        )
                    ].filename;
            } else {
                body.logoInternal = "";
            }
        } else {
            body.logo = "";
            body.logoInternal = "";
        }

        body.active = body.active === "true";

        const company = await createCompanyPageUseCase.execute(body);

        return response.status(201).send({
            message: "Company page created successfully",
        });
    }
}

export { CreateCompanyPageController };
