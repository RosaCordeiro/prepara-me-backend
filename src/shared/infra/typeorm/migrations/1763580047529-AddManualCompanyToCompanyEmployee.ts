import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddManualCompanyToCompanyEmployee1763580047529
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "manualCompany",
                type: "varchar",
                isNullable: true,
                comment: "Nome da empresa inserido manualmente pelo usuário",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("companyEmployees", "manualCompany");
    }
}
