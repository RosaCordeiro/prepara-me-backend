import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { inject, injectable } from "tsyringe";

@injectable()
class ListSpecialistScheduleToUserUseCase {
    constructor (
        @inject("SpecialistSchedulesRepository")
        private specialistSchedulesRepository: ISpecialistSchedulesRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({
        dateBegin,
        dateEnd,
        specialistId
    }) {
        if (dateBegin) {
            dateBegin = this.dateProvider.getDate(dateBegin);
            dateBegin.setHours(0, 0, 0);
        }

        if (dateEnd) {
            dateEnd = this.dateProvider.getDate(dateEnd);
            dateEnd.setHours(23, 59, 59);
        }

        const specialistSchedules =
            await this.specialistSchedulesRepository.findToUser({
                dateBegin,
                dateEnd,
                specialistId
            });

        return specialistSchedules;
    }
}

export { ListSpecialistScheduleToUserUseCase }