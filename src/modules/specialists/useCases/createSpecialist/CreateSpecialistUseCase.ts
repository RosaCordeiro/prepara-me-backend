import { ICreateSpecialistDTO } from "@modules/specialists/dtos/ICreateSpecialistDTO";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { Specialist } from "@modules/specialists/infra/typeorm/entities/Specialist";
import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateSpecialistUseCase {
    constructor(
        @inject("SpecialistsRepository")
        private specialistsRepository: ISpecialistsRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) {}

    async execute({
        name,
        bio,
        status,
        linkedinUrl,
        userId,
        id,
        image,
    }: ICreateSpecialistDTO): Promise<Specialist> {
        if (!name) {
            throw new AppError("Name can't be null");
        }

        if (!bio) {
            throw new AppError("Bio can't be null");
        }

        if (!Object.values(SpecialistStatusEnum).includes(status)) {
            throw new AppError("Status entered wrong");
        }

        if (!userId) {
            throw new AppError("User can't be null");
        }

        console.log(image);

        if (image !== undefined && image !== "" && image !== null) {
            image = await this.storageProvider.save(image, "specialists");
        }

        const specialist = await this.specialistsRepository.create({
            name,
            bio,
            status,
            userId,
            linkedinUrl,
            id,
            image,
        });

        return specialist;
    }
}

export { CreateSpecialistUseCase };

