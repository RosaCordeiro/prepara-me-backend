import { ICreateMaterialDTO } from "@modules/materials/dtos/ICreateMaterialDTO";
import { IMaterialRepository } from "@modules/materials/repositories/IMaterialRepository";
import { Material } from "../entities/Material";
import { Repository, getRepository } from "typeorm";

class MaterialRepository implements IMaterialRepository {
    private repository: Repository<Material>;

    constructor() {
        this.repository = getRepository(Material);
    }
    findAll(): Promise<Material[]> {
        return this.repository.find();
    }

    create(data: ICreateMaterialDTO): Promise<Material> {
        const material = this.repository.create(data);

        return this.repository.save(material);
    }

    async delete(id: string): Promise<void> {
        this.repository.delete(id);
    }

    findById(id: string): Promise<Material> {
        return this.repository.findOneOrFail(id);
    }

    findBySlug(slug: string): Promise<Material> {
        return this.repository.findOne({ slug });
    }
}

export { MaterialRepository };
