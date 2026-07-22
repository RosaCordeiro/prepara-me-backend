import { ICreateSubsegmentDTO } from "@modules/subsegments/dtos/ICreateSubsegmentDTO";
import { Subsegment } from "@modules/subsegments/infra/typeorm/entities/Subsegment";
import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateSubsegmentUseCase {
    constructor(
        @inject("SubsegmentsRepository")
        private subsegmentsRepository: ISubsegmentsRepository,
        @inject("SegmentsRepository")
        private segmentsRepository: ISegmentsRepository
    ) {}

    async execute({
        name,
        segmentId,
        id,
    }: ICreateSubsegmentDTO): Promise<Subsegment> {
        if (!name || !String(name).trim()) {
            throw new AppError("Name can't be null");
        }
        if (!segmentId) {
            throw new AppError("Segment is required");
        }

        const segment = await this.segmentsRepository.findById(segmentId);
        if (!segment) {
            throw new AppError("Segment not found");
        }

        const trimmed = String(name).trim();
        const existing = await this.subsegmentsRepository.findByNameInSegment(
            trimmed,
            segmentId
        );

        if (!id && existing) {
            throw new AppError("Subsegment already exists in this segment");
        }
        if (id && existing && existing.id !== id) {
            throw new AppError("Subsegment already exists in this segment");
        }

        return this.subsegmentsRepository.create({
            name: trimmed,
            segmentId,
            id,
        });
    }
}

export { CreateSubsegmentUseCase };
