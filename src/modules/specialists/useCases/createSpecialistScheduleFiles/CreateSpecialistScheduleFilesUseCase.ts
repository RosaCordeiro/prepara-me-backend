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

@injectable()
class CreateSpecialistScheduleFilesUseCase {
    constructor(
        @inject("SpecialistSchedulesFilesRepository")
        private specialistSchedulesFilesRepository: ISpecialistSchedulesFilesRepository
    ) {}

    async execute(
        data: ICreateSpecialistScheduleFileRequestDTO
    ): Promise<SpecialistScheduleFiles[]> {
        const specialistScheduleFile: SpecialistScheduleFiles[] = [];

        for (const file of data.files) {
            specialistScheduleFile.push(
                await this.specialistSchedulesFilesRepository.create({
                    id: data.id || undefined,
                    specialistScheduleId: data.specialistScheduleId,
                    ...file,
                })
            );
        }

        return specialistScheduleFile;
    }
}

export { CreateSpecialistScheduleFilesUseCase };
