import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class FindlAllMaterialPublicUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(): Promise<IResponseMaterialDTO[]> {
        const materials = await this.materialRepository.findAll();
        const materialsWithUrls = materials.map((material) => ({
            ...material,
            file_url: `${process.env.AWS_BUCKET_URL}/material/${material.file}`,
            image_url: material.image
                ? `${process.env.AWS_BUCKET_URL}/material-image/${material.image}`
                : null,
        }));
        return materialsWithUrls;
    }
}

export { FindlAllMaterialPublicUseCase };
