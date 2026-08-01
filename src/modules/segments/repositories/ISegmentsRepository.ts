import { ICreateSegmentDTO } from "../dtos/ICreateSegmentDTO";
import { Segment } from "../infra/typeorm/entities/Segment";

interface ISegmentsRepository {
    create(data: ICreateSegmentDTO): Promise<Segment>;
    find(data: { name?: string; id?: string }): Promise<Segment[]>;
    findById(id: string): Promise<Segment>;
    findByNameExact(name: string): Promise<Segment>;
    remove(id: string): Promise<void>;
    countSubsegments(segmentId: string): Promise<number>;
    countCompanies(segmentId: string): Promise<number>;
}

export { ISegmentsRepository };
