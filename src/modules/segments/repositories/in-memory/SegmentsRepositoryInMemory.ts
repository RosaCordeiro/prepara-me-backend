import { ICreateSegmentDTO } from "@modules/segments/dtos/ICreateSegmentDTO";
import { Segment } from "@modules/segments/infra/typeorm/entities/Segment";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";

class SegmentsRepositoryInMemory implements ISegmentsRepository {
    segments: Segment[] = [];

    async create({ name, id }: ICreateSegmentDTO): Promise<Segment> {
        const segment = new Segment(name, id);
        this.segments.push(segment);
        return segment;
    }

    async find({ name, id }: { name?: string; id?: string }): Promise<Segment[]> {
        return this.segments.filter((s) => {
            if (id) return s.id === id;
            if (name) return s.name.toLowerCase().includes(name.toLowerCase());
            return true;
        });
    }

    async findById(id: string): Promise<Segment> {
        return this.segments.find((s) => s.id === id) || null;
    }

    async findByNameExact(name: string): Promise<Segment> {
        return (
            this.segments.find(
                (s) => s.name.toLowerCase() === name.toLowerCase()
            ) || null
        );
    }

    async remove(id: string): Promise<void> {
        this.segments = this.segments.filter((s) => s.id !== id);
    }

    async countSubsegments(): Promise<number> {
        return 0;
    }

    async countCompanies(segmentId: string): Promise<number> {
        return 0;
    }
}

export { SegmentsRepositoryInMemory };
