import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListSubsegmentUseCase {
    constructor(
        @inject("SubsegmentsRepository")
        private subsegmentsRepository: ISubsegmentsRepository
    ) {}

    async execute({
        name,
        id,
        segmentId,
    }: {
        name?: string;
        id?: string;
        segmentId?: string;
    }) {
        return this.subsegmentsRepository.find({ name, id, segmentId });
    }
}

export { ListSubsegmentUseCase };
