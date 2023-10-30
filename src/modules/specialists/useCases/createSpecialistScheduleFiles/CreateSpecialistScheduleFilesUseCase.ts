import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { AppError } from "@shared/errors/AppError";
import { formatDateToString } from "@utils/formatDate";
import { inject, injectable } from "tsyringe";
import { resolve } from "path";
import {
    ICreateSpecialistScheduleFileDTO,
    ICreateSpecialistScheduleFileRequestDTO,
} from "@modules/specialists/dtos/ICreateSpecialistScheduleFileDTO";
import { SpecialistScheduleFiles } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleFiles";
import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";
import { SpecialistScheduleFileTypeEnum } from "@modules/specialists/enums/SpecialistScheduleFileTypeEnum";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

@injectable()
class CreateSpecialistScheduleFilesUseCase {
    constructor(
        @inject("SpecialistSchedulesFilesRepository")
        private specialistSchedulesFilesRepository: ISpecialistSchedulesFilesRepository,

        @inject("StorageProvider")
        private storageProvider: IStorageProvider //provedor de armazenamento
    ) {}

    async execute(
        data: ICreateSpecialistScheduleFileRequestDTO
    ): Promise<SpecialistScheduleFiles[]> {
        const specialistScheduleFile: SpecialistScheduleFiles[] = [];
        let fileFolder = "specialistschedulesfiles";
        for (const file of data.files) {
            const resultUpload = await this.storageProvider.save(
                file.fileName,
                fileFolder
            );
            file.fileLink = `${process.env.AWS_BUCKET_URL}/${fileFolder}/${resultUpload}`;
            specialistScheduleFile.push(
                await this.specialistSchedulesFilesRepository.create({
                    specialistScheduleId: data.specialistScheduleId,
                    ...file,
                })
            );
        }
        const specialistScheduleFilesFind =
            await this.specialistSchedulesFilesRepository.find(
                data.specialistScheduleId
            );

        if (specialistScheduleFilesFind.length === 0) {
            throw new AppError("Files not found");
        }
        return specialistScheduleFile;
    }
}

export { CreateSpecialistScheduleFilesUseCase };
