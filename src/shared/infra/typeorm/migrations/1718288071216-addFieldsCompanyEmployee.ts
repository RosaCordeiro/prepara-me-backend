import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addFieldsCompanyEmployee1718288071216
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "subarea",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "level",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
