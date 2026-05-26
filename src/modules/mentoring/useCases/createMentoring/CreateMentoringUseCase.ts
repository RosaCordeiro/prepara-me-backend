import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class CreateMentoringUseCase {
    //aqui ele declara o constructor com os parametros que serao injetados no service
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        //resitorio de mentoria
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        //provedor de armazenamento
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        //provedor de agendamento
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        //provedor de data
        @inject("SpecialistsRepository")
        private specialistRepository: ISpecialistsRepository //repositorio de especialistas
    ) {}

    async execute(
        //principal metodo do service que aceita dois argumentos
        //content que e do tipo ICreateMentoringDTO e file que e do tipo string
        //(que talvez seja uma imagem eu acho)
        content: ICreateMentoringDTO,
        file: string
    ): Promise<Mentoring> {
        this.validInput(content);

        //aqui o validInput e chamado para verificar se os dados estao corretos
        //que seriam o titulo, a data e o mentorId, se nao o error e lancado no console

        const specialist = await this.specialistRepository.findById(
            content.mentorId
            //aqui ele obtem o especialista pelo mentorId que esta no content
        );

        if (specialist === null || specialist === undefined) {
            throw new AppError("Specialist not found");
            //caso o especialista nao seja encontrado ele retorna um erro
        }

        const newFileName = await this.storageProvider.save(file, "mentoring");
        //aqui ele salva o arquivo no storageProvider, passando o file e o nome da pasta
        content.image = newFileName;

        const rawDate = content.date; // "2026-05-27T12:00"

        const startDate = new Date(`${rawDate}:00`); // "2026-05-27T12:00:00"

        console.log("startDate parsed:", startDate);
        console.log("startDate válida?", !isNaN(startDate.getTime()));

        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        console.log("EndDate", endDate);

        const formatToISO = (date: Date): string => {
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
                date.getDate()
            )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
                date.getSeconds()
            )}-03:00`;
            //                                                                                                                                                              ^^^^^^
        };

        const dateMasked = formatToISO(startDate);
        const dateMaskedEnd = formatToISO(endDate);

        const event = await this.scheduleGoogle.scheduleEvent(
            `${content.title}`,
            "Online",
            "Estamos aguardando você",
            dateMasked,
            dateMaskedEnd,
            "America/Sao_Paulo",
            [{ email: specialist.user.email }]
        );

        console.log("event", event);

        content.linkMeet = event.data.hangoutLink;
        content.eventId = event.data.id;
        delete content.id;
        delete content.users;

        //mentoria criada usando o repositorio de mentoria
        const mentoring = await this.mentoringRepository.create({
            ...content,
        });

        return mentoring;
    }

    //chamado la em cima no execute e aqui ele verifica se os dados estao corretos
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

        if (
            content.date === null ||
            content.date === undefined ||
            String(content.date) === ""
        ) {
            throw new AppError("Date can't be null");
        }
    }
}

export { CreateMentoringUseCase };
