import { container } from "tsyringe";
import { ISegmentsRepository } from "@modules/segments/repositories/ISegmentsRepository";
import { SegmentsRepository } from "@modules/segments/infra/typeorm/repositories/SegmentsRepository";
import { ISubsegmentsRepository } from "@modules/subsegments/repositories/ISubsegmentsRepository";
import { SubsegmentsRepository } from "@modules/subsegments/infra/typeorm/repositories/SubsegmentsRepository";

container.registerSingleton<ISegmentsRepository>(
    "SegmentsRepository",
    SegmentsRepository
);

container.registerSingleton<ISubsegmentsRepository>(
    "SubsegmentsRepository",
    SubsegmentsRepository
);
