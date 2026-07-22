import { ICreateSubsegmentDTO } from "@modules/subsegments/dtos/ICreateSubsegmentDTO";
import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { getRepository, Repository } from "typeorm";
import { Subsegment } from "../entities/Subsegment";
import { Company } from "@modules/company/infra/typeorm/entities/Company";

class SubsegmentsRepository implements ISubsegmentsRepository {
    private repository: Repository<Subsegment>;
    private companiesRepository: Repository<Company>;

    constructor() {
        this.repository = getRepository(Subsegment);
        this.companiesRepository = getRepository(Company);
    }

    async create({
        name,
        segmentId,
        id,
    }: ICreateSubsegmentDTO): Promise<Subsegment> {
        const subsegment = this.repository.create({ name, segmentId, id });
        await this.repository.save(subsegment);
        return subsegment;
    }

    async findById(id: string): Promise<Subsegment> {
        if (!id) return null;
        return this.repository.findOne(id, { relations: ["segment"] });
    }

    async findByNameInSegment(
        name: string,
        segmentId: string
    ): Promise<Subsegment> {
        return this.repository
            .createQueryBuilder("ss")
            .where("ss.segmentId = :segmentId", { segmentId })
            .andWhere("LOWER(ss.name) = LOWER(:name)", { name })
            .getOne();
    }

    async find({
        name,
        id,
        segmentId,
    }: {
        name?: string;
        id?: string;
        segmentId?: string;
    }): Promise<Subsegment[]> {
        const query = this.repository
            .createQueryBuilder("ss")
            .leftJoinAndSelect("ss.segment", "segment");

        if (id) {
            query.andWhere("ss.id = :id", { id });
        } else {
            if (segmentId) {
                query.andWhere("ss.segmentId = :segmentId", { segmentId });
            }
            if (name) {
                query.andWhere("ss.name ILIKE :name", { name: `%${name}%` });
            }
        }

        query.orderBy("ss.name", "ASC");
        return query.getMany();
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async countCompanies(subsegmentId: string): Promise<number> {
        return this.companiesRepository.count({ where: { subsegmentId } });
    }
}

export { SubsegmentsRepository };
