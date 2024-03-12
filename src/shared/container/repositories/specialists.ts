import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { SpecialistsRepository } from "@modules/specialists/infra/typeorm/repositories/SpecialistsRepository";
import { ProductsSpecialistsRepository } from "@modules/specialists/infra/typeorm/repositories/ProductsSpecialistsRepository";
import { IProductsSpecialistsRepository } from "@modules/specialists/repositories/IProductsSpecialistsRepository";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { container } from "tsyringe";
import { SpecialistSchedulesRepository } from "@modules/specialists/infra/typeorm/repositories/SpecialistSchedulesRepository";
import { SpecialistSchedulesFilesRepository } from "@modules/specialists/infra/typeorm/repositories/SpecialistSchedulesFilesRepository";
import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";
import { SpecialistSchedulesCancelRepository } from "@modules/specialists/infra/typeorm/repositories/SpecialistSchedulesCancelRepository";
import { ISpecialistSchedulesCancelRepository } from "@modules/specialists/repositories/ISpecialistSchedulesCancelRepository";

container.registerSingleton<ISpecialistsRepository>(
    "SpecialistsRepository",
    SpecialistsRepository
);

container.registerSingleton<ISpecialistSchedulesRepository>(
    "SpecialistSchedulesRepository",
    SpecialistSchedulesRepository
);

container.registerSingleton<IProductsSpecialistsRepository>(
    "ProductsSpecialistsRepository",
    ProductsSpecialistsRepository
);

container.registerSingleton<ISpecialistSchedulesFilesRepository>(
    "SpecialistSchedulesFilesRepository",
    SpecialistSchedulesFilesRepository
);

container.registerSingleton<ISpecialistSchedulesCancelRepository>(
    "SpecialistSchedulesCancelRepository",
    SpecialistSchedulesCancelRepository
);
