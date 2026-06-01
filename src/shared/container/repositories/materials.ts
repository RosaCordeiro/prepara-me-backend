import { container } from "tsyringe";

import { IMaterialRepository } from "@modules/materials/repositories/IMaterialRepository";
import { MaterialRepository } from "@modules/materials/infra/typeorm/repository/MaterialRepository";
import { IMaterialDownloadRepository } from "@modules/materials/repositories/IMaterialDownloadRepository";
import { MaterialDownloadRepository } from "@modules/materials/infra/typeorm/repository/MaterialDownloadRepository";

container.registerSingleton<IMaterialRepository>(
    "MaterialRepository",
    MaterialRepository
);

container.registerSingleton<IMaterialDownloadRepository>(
    "MaterialDownloadRepository",
    MaterialDownloadRepository
);
