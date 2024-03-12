import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addFieldsCompanyEmployee1705411919974
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "entryDate",
                type: "timestamp",
                isNullable: true,
            }),
            new TableColumn({
                name: "position",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "department",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "plan",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
