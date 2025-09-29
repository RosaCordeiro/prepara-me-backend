import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { UserRealocatedLog } from "@modules/accounts/infra/typeorm/entities/UserRealocatedLog";
import { getRepository, Repository } from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

class ReplacementsReport {
    private repository: Repository<User>;
    constructor() {
        this.repository = getRepository(User);
    }

    async report(
        startDate: string,
        endDate: string,
        companyId?: string
    ): Promise<any[]> {
        const adjustedEndDate = `${endDate} 23:59:59`;
        const query = this.repository
            .createQueryBuilder("user")
            .leftJoin(UserRealocatedLog, "log", "log.userId = user.id")
            .select([
                "user.id as userId",
                "user.created_at as entryDate",
                "log.created_at as replacementDate",
            ])
            .where("user.created_at >= :startDate", { startDate })
            .andWhere("user.created_at <= :adjustedEndDate", {
                adjustedEndDate,
            });

        if (companyId) {
            query.andWhere("user.companyId = :companyId", { companyId });
        }
        query.addSelect("user.companyId", "companyId");
        return query.getRawMany();
    }
}
export { ReplacementsReport };
