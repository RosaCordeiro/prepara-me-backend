import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addnPackageDeclinedCompanyEmployee1715881532548
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "packageDeclined",
                type: "boolean",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
