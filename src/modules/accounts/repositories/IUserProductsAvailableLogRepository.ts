import { ICreateUserProductAvailablLogDTO } from "../dtos/ICreateUserProductAvailableLogDTO";

import { UserProductAvailableLog } from "../infra/typeorm/entities/UserProductAvailableLog";

interface IUserProductsAvailableLogRepository {
    create(
        data: ICreateUserProductAvailablLogDTO
    ): Promise<UserProductAvailableLog>;
}

export { IUserProductsAvailableLogRepository };
