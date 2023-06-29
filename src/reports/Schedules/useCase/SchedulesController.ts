import { Request, Response } from "express";
import { SchedulesUseCase } from "./SchedulesUseCase";

import fs from "fs";

class ScheduleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { initialDate, finalDate } = request.query;

        let schedulesUseCase = new SchedulesUseCase();

        const results = await schedulesUseCase.execute(
            String(initialDate),
            String(finalDate)
        );

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

export { ScheduleController };

