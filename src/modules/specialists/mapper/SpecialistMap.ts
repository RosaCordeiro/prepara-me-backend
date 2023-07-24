import { UserMap } from "@modules/accounts/mapper/UserMap";
import { instanceToInstance } from "class-transformer";
import { ISpecialistResponseDTO } from "../dtos/ISpecialistResponseDTO";
import { Specialist } from "../infra/typeorm/entities/Specialist";

class SpecialistMap {
    static toDTO({
        id,
        name,
        bio,
        linkedinUrl,
        specialistSchedule,
        status,
        user,
        productSpecialist,
        image,
    }: Specialist): ISpecialistResponseDTO {
        const statusMapped = status === "ACTIVE" ? "Ativo" : "Inativo";

        const specialist = instanceToInstance({
            id,
            name,
            bio,
            linkedinUrl,
            specialistSchedule,
            status: { label: statusMapped, value: status },
            user: user
                ? process.env.NODE_ENV === "test"
                    ? user
                    : UserMap.toDTO(user)
                : null,
            productSpecialist,
            image:
                image !== null
                    ? `${process.env.AWS_BUCKET_URL}/specialists/${image}`
                    : "https://preparame-backend.s3.sa-east-1.amazonaws.com/avatar/nopic.png",
        });

        return specialist;
    }
}

export { SpecialistMap };

