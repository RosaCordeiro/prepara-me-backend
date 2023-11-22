import { ICreateMaterialDTO } from "../dtos/ICreateMaterialDTO";
import { Material } from "../infra/typeorm/entities/Material";

interface IMaterialRepository {
    create(data: ICreateMaterialDTO): Promise<Material>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Material[]>;
    findById(id: string): Promise<Material>;
    findBySlug(slug: string): Promise<Material>;
}

export { IMaterialRepository };
