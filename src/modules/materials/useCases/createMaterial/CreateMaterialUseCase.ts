import { ICreateMaterialDTO } from "@modules/materials/dtos/ICreateMaterialDTO";
import { Material } from "@modules/materials/infra/typeorm/entities/Material";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";
import { ICreateMentoringDTO } from "@modules/mentoring/dtos/ICreateMentoring";
import { Mentoring } from "@modules/mentoring/infra/typeorm/entities/Mentoring";

import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";
import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class CreateMaterialUseCase {
    //aqui ele declara o constructor com os parametros que serao injetados no service
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository,
        //resitorio de mentoria
        @inject("StorageProvider")
        private storageProvider: IStorageProvider //repositorio de especialistas
    ) {}

    async execute(
        content: ICreateMaterialDTO,
        image?: string
    ): Promise<Material> {
        this.validInput(content);

        if (image) {
            const newImageName = await this.storageProvider.save(
                image,
                "material-image"
            );
            content.image = newImageName;
        } else {
            delete content.image;
        }

        return await this.materialRepository.create(content);
    }

    validInput(content: ICreateMaterialDTO): void {
        if (
            content.link === "" ||
            content.link === undefined ||
            content.link === null
        ) {
            throw new AppError("Link is required");
        }
    }
}

export { CreateMaterialUseCase };
