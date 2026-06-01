import { ICreateUserRealocatedLogDTO } from "../dtos/ICreateUserRealocatedLogDTO";
import { UserRealocatedLog } from "../infra/typeorm/entities/UserRealocatedLog";

interface IUsersRealocatedLogRepository {
    create(data: ICreateUserRealocatedLogDTO): Promise<UserRealocatedLog>;
}

export { IUsersRealocatedLogRepository };
