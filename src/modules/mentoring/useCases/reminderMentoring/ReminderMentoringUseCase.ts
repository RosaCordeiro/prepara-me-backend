import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { resolve } from "path";

import { inject, injectable } from "tsyringe";

@injectable()
class ReminderMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("SESMailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(): Promise<void> {
        const mentoringList =
            await this.mentoringRepository.reminderMentoring();

        try {
            //resolve é para concatenar caminhos, pegando o email dinamico

            //hbs é um formato de template engine que vc pode usar para criar templates de em html

            mentoringList.forEach(async (mentoring) => {
                const { title, hour, linkMeet, email } = mentoring;

                const variables = {
                    title: title,
                    hour: hour,
                    link: linkMeet,
                };
                //parte que imprime dessa maneira no console title: "jsijasijas" por exemplo
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Enviando e-mail", variables);
                void this.mailProvider.sendMail(
                    email,
                    `Lembrete: mentoria de recolocação ${
                        mentoring.type === "1" ? "em 1 hora" : "amanhã"
                    } na Prepara.me`,
                    variables,
                    resolve(
                        __dirname,
                        "..",
                        "..",
                        "views",
                        "emails",
                        //aqui ele entra em um if ternário, ? significa o se e o : se não
                        mentoring.type === "1"
                            ? "reminder1hour.hbs"
                            : "reminder24hours.hbs"
                    )
                    //templatePath é o caminho do template que vc criou que ta declarado ali em cima
                    //variables a variavel que vc quer passar para o template que declarou ali em cima
                );
            });
        } catch (error) {
            console.log("error send email", error);
        }
    }
}

export { ReminderMentoringUseCase };
