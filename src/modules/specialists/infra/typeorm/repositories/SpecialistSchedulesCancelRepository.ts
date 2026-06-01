import { SpecialistScheduleCancel } from "@modules/specialists/infra/typeorm/entities/SpecialistScheduleCancel";
import { getRepository, Repository } from "typeorm";
import { ISpecialistSchedulesCancelRepository } from "@modules/specialists/repositories/ISpecialistSchedulesCancelRepository";

import { ICreateSpecialistScheduleCancelDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleCancelDTO";

class SpecialistSchedulesCancelRepository
    implements ISpecialistSchedulesCancelRepository
{
    private repository: Repository<SpecialistScheduleCancel>;

    constructor() {
        this.repository = getRepository(SpecialistScheduleCancel);
    }

    async create(
        data: ICreateSpecialistScheduleCancelDTO
    ): Promise<SpecialistScheduleCancel> {
        console.log("tentando gravar o log", data);

        const specialistScheduleCancel = this.repository.create(data);
        console.log("Teste", specialistScheduleCancel);

        await this.repository.save(specialistScheduleCancel);

        return specialistScheduleCancel;
    }
}

export { SpecialistSchedulesCancelRepository };
