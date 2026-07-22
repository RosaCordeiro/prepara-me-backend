import { ICreateSegmentDTO } from "@modules/segments/dtos/ICreateSegmentDTO";
import { Segment } from "@modules/segments/infra/typeorm/entities/Segment";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateSegmentUseCase {
    constructor(
        @inject("SegmentsRepository")
        private segmentsRepository: ISegmentsRepository
    ) {}

    async execute({ name, id }: ICreateSegmentDTO): Promise<Segment> {
        if (!name || !String(name).trim()) {
            throw new AppError("Name can't be null");
        }

        const trimmed = String(name).trim();
        const existing = await this.segmentsRepository.findByNameExact(trimmed);

        if (!id && existing) {
            throw new AppError("Segment already exists");
        }

        if (id && existing && existing.id !== id) {
            throw new AppError("Segment already exists");
        }

        return this.segmentsRepository.create({ name: trimmed, id });
    }
}

export { CreateSegmentUseCase };
