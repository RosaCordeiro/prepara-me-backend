import { ICreateSubsegmentDTO } from "@modules/subsegments/dtos/ICreateSubsegmentDTO";
import { Subsegment } from "@modules/subsegments/infra/typeorm/entities/Subsegment";
import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";

class SubsegmentsRepositoryInMemory implements ISubsegmentsRepository {
    subsegments: Subsegment[] = [];

    async create({
        name,
        segmentId,
        id,
    }: ICreateSubsegmentDTO): Promise<Subsegment> {
        const subsegment = new Subsegment(name, segmentId, id);
        this.subsegments.push(subsegment);
        return subsegment;
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
        return this.subsegments.filter((s) => {
            if (id) return s.id === id;
            if (segmentId && s.segmentId !== segmentId) return false;
            if (name && !s.name.toLowerCase().includes(name.toLowerCase()))
                return false;
            return true;
        });
    }

    async findById(id: string): Promise<Subsegment> {
        return this.subsegments.find((s) => s.id === id) || null;
    }

    async findByNameInSegment(
        name: string,
        segmentId: string
    ): Promise<Subsegment> {
        return (
            this.subsegments.find(
                (s) =>
                    s.segmentId === segmentId &&
                    s.name.toLowerCase() === name.toLowerCase()
            ) || null
        );
    }

    async remove(id: string): Promise<void> {
        this.subsegments = this.subsegments.filter((s) => s.id !== id);
    }

    async countCompanies(): Promise<number> {
        return 0;
    }
}

export { SubsegmentsRepositoryInMemory };
