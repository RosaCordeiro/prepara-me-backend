import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { IEditMentoringDTO } from "@modules/mentoring/dtos/IEditMentoring";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class EditMentoringUseCase {
    constructor(
        @inject("MentoringRepository")
        private mentoringRepository: MentoringRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute(
        mentoringId: string,
        content: IEditMentoringDTO
    ): Promise<void> {
        if (
            mentoringId === null ||
            mentoringId === undefined ||
            mentoringId === ""
        ) {
            throw new AppError("Mentoring id can't be null");
        }

        const mentoringObj = await this.mentoringRepository.findById(
            mentoringId
        );

        if (mentoringObj === null || mentoringObj === undefined) {
            throw new AppError("Mentoring not found");
        }

        if (content.file !== undefined) {
            await this.storageProvider.save(content.file, "mentoring");
            content.image = content.file;
            delete content.file;
        }

        await this.mentoringRepository.update(mentoringId, content);
    }

    validInput(content: ICreateMentoringDTO): void {
        console.log(content);
        console.log(content.title);

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

export { EditMentoringUseCase };

