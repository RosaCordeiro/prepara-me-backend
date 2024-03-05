import { getRepository, Repository } from "typeorm";

import { IUsersRealocatedLogRepository } from "@modules/accounts/repositories/IUsersRealocatedLogRepository";
import { UserRealocatedLog } from "../entities/UserRealocatedLog";
import { ICreateUserRealocatedLogDTO } from "@modules/accounts/dtos/ICreateUserRealocatedLogDTO";

class UsersRealocatedLogRepository implements IUsersRealocatedLogRepository {
    private repository: Repository<UserRealocatedLog>;

    constructor() {
        this.repository = getRepository(UserRealocatedLog);
    }

    async create({
        userId,
    }: ICreateUserRealocatedLogDTO): Promise<UserRealocatedLog> {
        const hasRegister = await this.repository.findOne({ userId });

        if (hasRegister) {
            return hasRegister;
        }

        const userRealocatedLog = this.repository.create({
            userId,
        });

        return this.repository.save(userRealocatedLog);
    }
}

export { UsersRealocatedLogRepository };
