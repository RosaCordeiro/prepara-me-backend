import fs from 'fs';
import { Response, Request } from "express"
import { UsersReportUseCase } from "./UsersReportUseCase"
import { container } from 'tsyringe';

class UsersReportController {
    async handle (request: Request, response: Response): Promise<Response> {
        const usersReportUseCase = container.resolve(
            UsersReportUseCase
        )

        const result = await usersReportUseCase.execute()

        if (!result.success) {
            return response.status(409).send({
                message: 'Não foi possível gerar o relatório.'
            })
        }

        try {
            response
                .status(200)
                .download(result.path, '', { dotfiles: "deny" }, () => {
                    fs.unlinkSync(result.path)
                })
        } catch (error) {
            return response.status(409).send({
                message: 'Não foi possível gerar o relatório.'
            })
        }
    }
}

export { UsersReportController }