import { ICreateMaterialDTO } from "@modules/materials/dtos/ICreateMaterialDTO";
import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
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
class GetMaterialBySlugUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(slug: string): Promise<IResponseMaterialDTO> {
        const material = await this.materialRepository.findBySlug(slug);

        if (!material) {
            throw new AppError("Material not found");
        }

        return {
            ...material,
            file_url: `${process.env.AWS_BUCKET_URL}/material/${material.file}`,
            image_url: material.image
                ? `${process.env.AWS_BUCKET_URL}/material-image/${material.image}`
                : undefined,
        };
    }
}

export { GetMaterialBySlugUseCase };
