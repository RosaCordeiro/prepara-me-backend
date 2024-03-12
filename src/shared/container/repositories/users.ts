import { container } from "tsyringe";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UserTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UserTokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { UserProductsAvailableRepository } from "@modules/accounts/infra/typeorm/repositories/UserProductsAvailableRepository";
import { SubscriptionNewslettersRepository } from "@modules/accounts/infra/typeorm/repositories/SubscriptionNewslettersRepository";
import { ISubscriptionNewslettersRepository } from "@modules/accounts/repositories/ISubcriptionNewslettersRepository";
import { IUsersRealocatedLogRepository } from "@modules/accounts/repositories/IUsersRealocatedLogRepository";
import { UsersRealocatedLogRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRealocatedLogRepository";

container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
);

container.registerSingleton<IUserTokensRepository>(
    "UserTokensRepository",
    UserTokensRepository
);

container.registerSingleton<IUserProductsAvailableRepository>(
    "UserProductsAvailableRepository",
    UserProductsAvailableRepository
);

container.registerSingleton<ISubscriptionNewslettersRepository>(
    "SubscriptionNewslettersRepository",
    SubscriptionNewslettersRepository
);

container.registerSingleton<IUsersRealocatedLogRepository>(
    "UsersRealocatedLogRepository",
    UsersRealocatedLogRepository
);
