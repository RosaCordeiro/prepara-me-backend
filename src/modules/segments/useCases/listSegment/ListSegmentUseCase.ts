import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListSegmentUseCase {
    constructor(
        @inject("SegmentsRepository")
        private segmentsRepository: ISegmentsRepository
    ) {}

    async execute({ name, id }: { name?: string; id?: string }) {
        return this.segmentsRepository.find({ name, id });
    }
}

export { ListSegmentUseCase };
