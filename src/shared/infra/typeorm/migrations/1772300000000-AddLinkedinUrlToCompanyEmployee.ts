import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLinkedinUrlToCompanyEmployee1772300000000
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyEmployees",
            new TableColumn({
                name: "linkedinUrl",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("companyEmployees", "linkedinUrl");
    }
}
