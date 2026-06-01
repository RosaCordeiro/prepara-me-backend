import { UserMap } from "@modules/accounts/mapper/UserMap";
import { ProductMap } from "@modules/products/mapper/ProductMap";
import { instanceToInstance } from "class-transformer";
import { ISpecialistScheduleResponseDTO } from "../dtos/ISpecialistScheduleResponseDTO";
import { SpecialistScheduleStatusEnum } from "../enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "../infra/typeorm/entities/SpecialistSchedule";
import { SpecialistMap } from "./SpecialistMap";

class SpecialistScheduleMap {
    static toDTO({
        id,
        status,
        user,
        comments,
        dateSchedule,
        hangoutLink,
        product,
        scheduleEventId,
        specialist,
        rating,
        filesCountUser,
        filesCountSpecialist,
    }: any): ISpecialistScheduleResponseDTO {
        const statusMapped =
            status === SpecialistScheduleStatusEnum.AVAILABLE
                ? "Disponível"
                : "Indisponível";

        const specialistSchedule = instanceToInstance({
            id,
            status: { label: statusMapped, value: status },
            comments,
            dateSchedule,
            hangoutLink,
            product: product ? ProductMap.toDTO(product) : null,
            productId: product ? product.id : null,
            scheduleEventId,
            user: user
                ? process.env.NODE_ENV === "test"
                    ? user
                    : UserMap.toDTO(user)
                : null,
            userId: user ? user.id : null,
            specialist: specialist ? SpecialistMap.toDTO(specialist) : null,
            specialistId: specialist ? specialist.id : null,
            rating,
            filesCountUser,
            filesCountSpecialist,
        });

        return specialistSchedule;
    }
}

export { SpecialistScheduleMap };
