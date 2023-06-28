import { container } from "tsyringe";

import { ClickCountRepository } from "@modules/clicks/infra/typeorm/repositories/ClickCountRepository";
import { IClickCountRepository } from "@modules/clicks/repositories/IClickCountRepository";
import { ClickNamesRepository } from "@modules/clicks/infra/typeorm/repositories/ClickNamesRepository";
import { IClickNamesRepository } from "@modules/clicks/repositories/IClickNamesRepository";

container.registerSingleton<IClickCountRepository>(
    "ClickCountRepository",
    ClickCountRepository
);

container.registerSingleton<IClickNamesRepository>(
    "ClickNamesRepository",
    ClickNamesRepository
);

