import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDiversityFieldsToCompanyEmployee1772000000000
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "gender",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "etnia",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "pcd",
                type: "boolean",
                isNullable: true,
            }),
            new TableColumn({
                name: "location",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("companyEmployees", "gender");
        await queryRunner.dropColumn("companyEmployees", "etnia");
        await queryRunner.dropColumn("companyEmployees", "pcd");
        await queryRunner.dropColumn("companyEmployees", "location");
    }
}
