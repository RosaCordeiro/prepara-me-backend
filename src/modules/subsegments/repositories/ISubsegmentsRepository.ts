import { ICreateSubsegmentDTO } from "../dtos/ICreateSubsegmentDTO";
import { Subsegment } from "../infra/typeorm/entities/Subsegment";

interface ISubsegmentsRepository {
    create(data: ICreateSubsegmentDTO): Promise<Subsegment>;
    find(data: {
        name?: string;
        id?: string;
        segmentId?: string;
    }): Promise<Subsegment[]>;
    findById(id: string): Promise<Subsegment>;
    findByNameInSegment(
        name: string,
        segmentId: string
    ): Promise<Subsegment>;
    remove(id: string): Promise<void>;
    countCompanies(subsegmentId: string): Promise<number>;
}

export { ISubsegmentsRepository };
