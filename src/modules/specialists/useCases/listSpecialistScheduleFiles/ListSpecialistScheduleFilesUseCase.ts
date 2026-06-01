import { inject, injectable } from "tsyringe";
import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";
import { IListSpecialistScheduleFileDTO } from "@modules/specialists/dtos/IListSpecialistScheduleFileDTO";
import { SpecialistScheduleFiles } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleFiles";
import { ISpecialistScheduleFileResponseDTO } from "@modules/specialists/dtos/ISpecialistScheduleFileResponseDTO";
@injectable()
class ListSpecialistScheduleFilesUseCase {
    constructor(
        @inject("SpecialistSchedulesFilesRepository")
        private specialistSchedulesFilesRepository: ISpecialistSchedulesFilesRepository
    ) {}

    async execute(
        data: IListSpecialistScheduleFileDTO
    ): Promise<ISpecialistScheduleFileResponseDTO[]> {
        const result = await this.specialistSchedulesFilesRepository.find(
            data.specialistScheduleId,
            data.fileType
        );
        return result;
    }
}

export { ListSpecialistScheduleFilesUseCase };

