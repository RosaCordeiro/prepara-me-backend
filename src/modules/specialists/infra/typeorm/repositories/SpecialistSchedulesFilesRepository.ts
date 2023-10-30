import { getRepository, Repository } from "typeorm";
import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";
import { SpecialistScheduleFiles } from "../entities/SpecialistScheduleFiles";
import { ICreateSpecialistScheduleFileDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleFileDTO";
import { ISpecialistScheduleFileResponseDTO } from "@modules/specialists/dtos/ISpecialistScheduleFileResponseDTO";
import { SpecialistScheduleFileTypeEnum } from "@modules/specialists/enums/SpecialistScheduleFileTypeEnum";

class SpecialistSchedulesFilesRepository
    implements ISpecialistSchedulesFilesRepository
{
    private repository: Repository<SpecialistScheduleFiles>;

    constructor() {
        this.repository = getRepository(SpecialistScheduleFiles);
    }

    countFilesBySpecialistScheduleIdAndType(
        specialistScheduleId: string,
        fileType: SpecialistScheduleFileTypeEnum
    ): Promise<number> {
        const countFilesQuery = this.repository
            .createQueryBuilder("ssf")
            .where("ssf.specialistScheduleId = :specialistScheduleId", {
                specialistScheduleId,
            })
            .andWhere("ssf.fileType = :fileType", { fileType });

        return countFilesQuery.getCount();
    }

    async create(
        data: ICreateSpecialistScheduleFileDTO
    ): Promise<SpecialistScheduleFiles> {
        const specialistScheduleFile = this.repository.create(data);
        console.log(specialistScheduleFile);

        await this.repository.save(specialistScheduleFile);

        return specialistScheduleFile;
    }

    async find(
        specialistScheduleId: string,
        fileType?: SpecialistScheduleFileTypeEnum
    ): Promise<ISpecialistScheduleFileResponseDTO[]> {
        const specialistScheduleFilesQuery = this.repository
            .createQueryBuilder("ssf")
            .where("ssf.specialistScheduleId = :specialistScheduleId", {
                specialistScheduleId,
            });
        if (fileType) {
            specialistScheduleFilesQuery.andWhere("ssf.fileType = :fileType", {
                fileType,
            });
        }
        const specialistScheduleFiles =
            await specialistScheduleFilesQuery.getMany();

        return specialistScheduleFiles;
    }

    async remove(id: string): Promise<string> {
        await this.repository.delete(id);

        return id;
    }
}

export { SpecialistSchedulesFilesRepository };
