import { ICreateSegmentDTO } from "@modules/segments/dtos/ICreateSegmentDTO";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { getRepository, Repository } from "typeorm";
import { Segment } from "../entities/Segment";
import { Subsegment } from "@modules/subsegments/infra/typeorm/entities/Subsegment";
import { Company } from "@modules/company/infra/typeorm/entities/Company";

class SegmentsRepository implements ISegmentsRepository {
    private repository: Repository<Segment>;
    private subsegmentsRepository: Repository<Subsegment>;
    private companiesRepository: Repository<Company>;

    constructor() {
        this.repository = getRepository(Segment);
        this.subsegmentsRepository = getRepository(Subsegment);
        this.companiesRepository = getRepository(Company);
    }

    async create({ name, id }: ICreateSegmentDTO): Promise<Segment> {
        const segment = this.repository.create({ name, id });
        await this.repository.save(segment);
        return segment;
    }

    async findById(id: string): Promise<Segment> {
        if (!id) return null;
        return this.repository.findOne(id);
    }

    async findByNameExact(name: string): Promise<Segment> {
        return this.repository
            .createQueryBuilder("s")
            .where("LOWER(s.name) = LOWER(:name)", { name })
            .getOne();
    }

    async find({ name, id }: { name?: string; id?: string }): Promise<Segment[]> {
        const query = this.repository.createQueryBuilder("s");

        if (id) {
            query.andWhere("s.id = :id", { id });
        } else if (name) {
            query.andWhere("s.name ILIKE :name", { name: `%${name}%` });
        }

        query.orderBy("s.name", "ASC");
        return query.getMany();
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countSubsegments(segmentId: string): Promise<number> {
        return this.subsegmentsRepository.count({ where: { segmentId } });
    }

    async countCompanies(segmentId: string): Promise<number> {
        return this.companiesRepository.count({ where: { segmentId } });
    }
}

export { SegmentsRepository };
