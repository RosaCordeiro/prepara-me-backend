import { IResponseMaterialDTO } from "@modules/materials/dtos/IResponseMaterialDTO";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";

import { inject, injectable } from "tsyringe";

@injectable()
class FindAllMaterialUseCase {
    constructor(
        @inject("MaterialRepository")
        private materialRepository: MaterialRepository
    ) {}

    async execute(): Promise<IResponseMaterialDTO[]> {
        const result = await this.materialRepository.findAll();
        result.map((item) => {
            item['image_url'] = item.image
                ? `${process.env.AWS_BUCKET_URL}/material-image/${item.image}`
                : null;
        })
        return result;
    }
}

export { FindAllMaterialUseCase };
