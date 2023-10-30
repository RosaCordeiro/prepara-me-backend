import { ICreateSpecialistScheduleFileDTO } from "../dtos/ICreateSpecialistScheduleFileDTO";
import { ISpecialistScheduleFileResponseDTO } from "../dtos/ISpecialistScheduleFileResponseDTO";
import { SpecialistScheduleFileTypeEnum } from "../enums/SpecialistScheduleFileTypeEnum";
import { SpecialistScheduleFiles } from "../infra/typeorm/entities/SpecialistScheduleFiles";

interface ISpecialistSchedulesFilesRepository {
    create(
        data: ICreateSpecialistScheduleFileDTO
    ): Promise<SpecialistScheduleFiles>;
    find(
        specialistScheduleId: string,
        fileType?: SpecialistScheduleFileTypeEnum
    ): Promise<ISpecialistScheduleFileResponseDTO[]>;
    remove(id: string): Promise<string>;
    countFilesBySpecialistScheduleIdAndType(
        specialistScheduleId: string,
        fileType: SpecialistScheduleFileTypeEnum
    ): Promise<number>;
}

export { ISpecialistSchedulesFilesRepository };
