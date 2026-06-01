import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { formatDateToString } from "@utils/formatDate";
import { resolve } from "path";

import { inject, injectable } from "tsyringe";

@injectable()
class AddParticipantMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        @inject("SESMailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(mentoringId: string, userId: string): Promise<void> {
        if (
            mentoringId === null ||
            mentoringId === undefined ||
            mentoringId === ""
        ) {
            throw new AppError("Mentoring id can't be null");
        }

        if (userId === null || userId === undefined || userId === "") {
            throw new AppError("User id can't be null");
        }

        const mentoringObj = await this.mentoringRepository.findById(
            mentoringId
        );

        if (mentoringObj === null || mentoringObj === undefined) {
            throw new AppError("Mentoring not found");
        }

        if (mentoringObj.users >= mentoringObj.vacancies) {
            throw new AppError("Mentoring is full");
        }

        const user = await this.userRepository.findById(userId);

        if (user === null || user === undefined) {
            throw new AppError("User not found");
        }

        mentoringObj.users = mentoringObj.users + 1;
        mentoringObj.usersMentoring.push(user);

        const newMentoring: any = JSON.parse(JSON.stringify(mentoringObj));
        delete newMentoring.mentor;
        newMentoring.mentorId = mentoringObj.mentor.id;

        await this.mentoringRepository.update(mentoringId, {
            ...newMentoring,
        });

        await this.scheduleGoogle.addAttendeeInEventByLink(
            mentoringObj.eventId,
            user.email
        );

        try {
            const templatePath = resolve(
                __dirname,
                "..",
                "..",
                "views",
                "emails",
                "mentoringCreate.hbs"
            );

            const variables = {
                name: user.name,
                mentoring: mentoringObj.title,
                specialist: mentoringObj.mentor.name,
                date: formatDateToString(mentoringObj.date),
                link: mentoringObj.linkMeet,
            };

            void this.mailProvider.sendMail(
                user.email,
                "Confirmação de participação em mentoria",
                variables,
                templatePath
            );
        } catch (error) {
            console.log("error send email", error);
        }
    }

    validInput(content: ICreateMentoringDTO): void {
        if (
            content.title === null ||
            content.title === "" ||
            content.title === undefined
        ) {
            throw new AppError("Title can't be null");
        }

        if (
            content.mentorId === null ||
            content.mentorId === "" ||
            content.mentorId === undefined
        ) {
            throw new AppError("Mentor can't be null");
        }

        if (content.date === null || content.date === undefined) {
            throw new AppError("Date can't be null");
        }
    }
}

export { AddParticipantMentoringUseCase };

/*   const templatePath = resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "forgotPassword.hbs"
        );

        const token = uuidV4();

        const expires_date = this.dateProvider.addHours(3);

        await this.usertokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date,
        });

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}#/password/reset/${token}`,
        };

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        ); */
