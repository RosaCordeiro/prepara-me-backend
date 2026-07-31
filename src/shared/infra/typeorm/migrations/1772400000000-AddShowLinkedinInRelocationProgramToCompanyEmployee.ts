import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddShowLinkedinInRelocationProgramToCompanyEmployee1772400000000
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "companyEmployees",
            new TableColumn({
                name: "showLinkedinInRelocationProgram",
                type: "boolean",
                default: true,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "companyEmployees",
            "showLinkedinInRelocationProgram"
        );
    }
}
