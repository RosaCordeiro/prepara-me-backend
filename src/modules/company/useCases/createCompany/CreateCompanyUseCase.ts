import { ICreateCompanyDTO } from "@modules/company/dtos/ICreateCompanyDTO";
import { Company } from "@modules/company/infra/typeorm/entities/Company";
import { ICompaniesRepository } from "@modules/company/repositories/ICompaniesRepository";
import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCompanyUseCase {
    constructor(
        @inject("CompaniesRepository")
        private companiesRepository: ICompaniesRepository,
        @inject("SubsegmentsRepository")
        private subsegmentsRepository: ISubsegmentsRepository,
        @inject("SegmentsRepository")
        private segmentsRepository: ISegmentsRepository
    ) {}

    async execute({
        id,
        name,
        segmentId,
        subsegmentId,
    }: ICreateCompanyDTO): Promise<Company> {
        if (!name) {
            throw new AppError("Name can't be null");
        }

        let resolvedSegmentId =
            segmentId === "" || segmentId === undefined ? null : segmentId;
        let resolvedSubsegmentId =
            subsegmentId === "" || subsegmentId === undefined
                ? null
                : subsegmentId;

        if (resolvedSubsegmentId) {
            const subsegment = await this.subsegmentsRepository.findById(
                resolvedSubsegmentId
            );
            if (!subsegment) {
                throw new AppError("Subsegment not found");
            }

            if (
                resolvedSegmentId &&
                resolvedSegmentId !== subsegment.segmentId
            ) {
                throw new AppError(
                    "Subsegment does not belong to the selected segment"
                );
            }

            resolvedSegmentId = subsegment.segmentId;
        }

        if (resolvedSegmentId) {
            const segment = await this.segmentsRepository.findById(
                resolvedSegmentId
            );
            if (!segment) {
                throw new AppError("Segment not found");
            }
        }

        const company = await this.companiesRepository.create({
            id,
            name,
            segmentId: resolvedSegmentId,
            subsegmentId: resolvedSubsegmentId,
        });

        return company;
    }
}

export { CreateCompanyUseCase };
