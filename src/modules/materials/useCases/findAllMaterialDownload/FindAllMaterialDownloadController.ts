import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindAllMaterialDownloadUseCase } from "./FindlAllMaterialDownloadUseCase";
import fs from "fs";

class FindAllMaterialDownloadController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findAllMaterialDownloadUseCase = container.resolve(
            FindAllMaterialDownloadUseCase
        );

        const results = await findAllMaterialDownloadUseCase.execute();

        if (results.success === false) {
            return response.status(409).send({
                message: "Não foi possível gerar o relatório.",
            });
        }

        try {
            response
                .status(200)
                .download(results.path, "", { dotfiles: "deny" }, () => {
                    fs.unlinkSync(results.path);
                });
        } catch (error) {
            return response.status(409).send({
                message: "Não foi possível gerar o relatório.",
            });
        }
    }
}

export { FindAllMaterialDownloadController };
