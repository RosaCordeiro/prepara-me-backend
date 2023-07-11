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
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("SpecialistsRepository")
        private specialistRepository: ISpecialistsRepository
    ) {}

    async execute(
        content: ICreateMentoringDTO,
        file: string
    ): Promise<Mentoring> {
        this.validInput(content);

        const specialist = await this.specialistRepository.findById(
            content.mentorId
        );

        if (specialist === null || specialist === undefined) {
            throw new AppError("Specialist not found");
        }

        await this.storageProvider.save(file, "mentoring");
        content.image = file;

        const dateMasked = this.dateProvider.formatDateTime(
            content.date,
            "YYYY-MM-DDThh:mm:ssfff:00"
        );

        const newDate = new Date(dateMasked);
        newDate.setHours(newDate.getHours() - 2);

        const dateMaskedEnd = this.dateProvider.formatDateTime(
            newDate,
            "YYYY-MM-DDThh:mm:ssfff:00"
        );

        const event = await this.scheduleGoogle.scheduleEvent(
            `Mentoria coletiva com o(a) especialista ${specialist.name}`,
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

        const mentoring = await this.mentoringRepository.create({
            ...content,
        });

        return mentoring;
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

