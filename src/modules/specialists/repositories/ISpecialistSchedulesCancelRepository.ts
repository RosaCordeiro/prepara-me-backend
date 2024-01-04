import { ICreateSpecialistScheduleCancelDTO } from "../dtos/ICreateSpecialistScheduleCancelDTO";
import { SpecialistScheduleCancel } from "../infra/typeorm/entities/SpecialistScheduleCancel";

interface ISpecialistSchedulesCancelRepository {
    create(
        data: ICreateSpecialistScheduleCancelDTO
    ): Promise<SpecialistScheduleCancel>;
}

export { ISpecialistSchedulesCancelRepository };
