import { container } from "tsyringe";

import { ProgressInterviewRepository } from "@modules/interview/infra/typeorm/repository/ProgressInterviewRepository";
import { IProgressInterviewRepository } from "@modules/interview/repositories/IProgressInterviewRepository";

container.registerSingleton<IProgressInterviewRepository>(
    "ProgressInterviewRepository",
    ProgressInterviewRepository
);
