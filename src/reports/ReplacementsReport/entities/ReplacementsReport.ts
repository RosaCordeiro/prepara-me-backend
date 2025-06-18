import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { UserRealocatedLog } from "@modules/accounts/infra/typeorm/entities/UserRealocatedLog";
import { getRepository, Repository } from "typeorm";

class ReplacementsReport {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
    }

    async report(
        startDate: string,
        endDate: string,
        companyId?: string
    ): Promise<any[]> {
        const adjustedEndDate = `${endDate} 23:59:59`;
        const query = this.repository
            .createQueryBuilder("employee")
            .leftJoin(UserRealocatedLog, "log", "log.userId = employee.userId")
            .select([
                "employee.id as id",
                "employee.entryDate as entryDate",
                "log.created_at as replacementDate",
            ])
            .where("employee.entryDate >= :startDate", { startDate })
            .andWhere("employee.entryDate <= :adjustedEndDate", {
                adjustedEndDate,
            });

        if (companyId) {
            query.andWhere("employee.companyId = :companyId", { companyId });
        }
        return query.getRawMany();
    }
}
export { ReplacementsReport };
