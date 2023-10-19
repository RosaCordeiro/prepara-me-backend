import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";
import { inject, injectable } from "tsyringe";
import { IRemoveSpecialistScheduleFileDTO } from "@modules/specialists/dtos/IRemoveSpecialistScheduleFilesDTO";
import { response } from "express";

@injectable()
class RemoveSpecialistScheduleFilesUsecase {
    constructor(
        @inject("SpecialistSchedulesFilesRepository")
        private specialistSchedulesFilesRepository: ISpecialistSchedulesFilesRepository
    ) {}

    async execute(data: IRemoveSpecialistScheduleFileDTO): Promise<void> {
        console.log(data.specialistScheduleId);
        await this.specialistSchedulesFilesRepository.remove(
            data.specialistScheduleId
        );
    }
}

export { RemoveSpecialistScheduleFilesUsecase };

