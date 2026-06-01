import { ICreateMaterialDTO } from "@modules/materials/dtos/ICreateMaterialDTO";
import { IMaterialDownloadRepository } from "@modules/materials/repositories/IMaterialDownloadRepository";
import { Repository, getRepository } from "typeorm";
import { MaterialDownload } from "../entities/MaterialDownload";
import { ICreateMaterialDownloadDTO } from "@modules/materials/dtos/ICreateMaterialDownloadDTO";
import { IResponseMaterialDownloadDTO } from "@modules/materials/dtos/IResponseMaterialDownloadDTO";

class MaterialDownloadRepository implements IMaterialDownloadRepository {
    private repository: Repository<MaterialDownload>;

    constructor() {
        this.repository = getRepository(MaterialDownload);
    }

    create(data: ICreateMaterialDownloadDTO): Promise<MaterialDownload> {
        const materialDownload = this.repository.create(data);

        return this.repository.save(materialDownload);
    }
    async findAll(): Promise<MaterialDownload[]> {
        const materials = await this.repository
            .createQueryBuilder("material_download")
            .select("name")
            .addSelect("email")
            .addSelect("phone")
            .addSelect("company")
            .addSelect("position")
            .addSelect("material_download.created_at")
            .addSelect("m.title", "material_name")
            .leftJoin("material", "m", "m.id = material_download.material_id")
            .getRawMany();

        return materials;
    }
}

export { MaterialDownloadRepository };
