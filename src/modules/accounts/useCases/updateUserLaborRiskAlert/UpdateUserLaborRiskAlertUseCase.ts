import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

@injectable()
class UpdateUserLaborRiskAlertUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("SESMailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute({ user_id, laborRiskAlert }): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        user.laborRiskAlert = laborRiskAlert;

        const userUpdated = await this.usersRepository.create(user);

        const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "helpPendings.hbs"
        );

        const variables = {
            name: user.name,
            company: user.subscribeToken,
        };

        const emails = ["lucy@prepara.me", "andrea@prepara.me"];

        for (const email of emails) {
            await this.mailProvider.sendMail(
                email,
                "PRECISO DE AJUDA COM PENDÊNCIA TRABALHISTA",
                variables,
                templatePath
            );
        }

        return userUpdated;
    }
}
export { UpdateUserLaborRiskAlertUseCase };

