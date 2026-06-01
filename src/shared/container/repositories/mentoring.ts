import { container } from "tsyringe";

import { IMentoringRepository } from "@modules/mentoring/repositories/IMentoringRepository";
import { MentoringRepository } from "@modules/mentoring/infra/typeorm/repository/MentoringRepository";

container.registerSingleton<IMentoringRepository>(
    "MentoringRepository",
    MentoringRepository
);

