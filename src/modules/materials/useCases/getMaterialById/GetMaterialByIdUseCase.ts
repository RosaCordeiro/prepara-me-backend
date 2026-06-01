import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";
import { AppError } from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
class GetMaterialByIdUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(id: string): Promise<IResponseMaterialDTO> {
        const material = await this.materialRepository.findById(id);

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

export { GetMaterialByIdUseCase };
