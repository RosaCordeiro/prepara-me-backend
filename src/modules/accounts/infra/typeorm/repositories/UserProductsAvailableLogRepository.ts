import { IUserProductAvailableResponseDTO } from "@modules/accounts/dtos/IUserProductAvailableResponseDTO";
import { UserProductsAvailableMap } from "@modules/accounts/mapper/UserProductsAvailable";

import { getRepository, Repository } from "typeorm";
import { UserProductAvailableLog } from "../entities/UserProductAvailableLog";
import { IUserProductsAvailableLogRepository } from "@modules/accounts/repositories/IUserProductsAvailableLogRepository";
import { ICreateUserProductAvailablLogDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableLogDTO";

class UserProductsAvailableLogRepository
    implements IUserProductsAvailableLogRepository
{
    private repository: Repository<UserProductAvailableLog>;

    constructor() {
        this.repository = getRepository(UserProductAvailableLog);
    }
    async create(
        data: ICreateUserProductAvailablLogDTO
    ): Promise<UserProductAvailableLog> {
        const userProductAvailableLog = this.repository.create(data);

        await this.repository.save(userProductAvailableLog);

        return userProductAvailableLog;
    }
}

export { UserProductsAvailableLogRepository };
