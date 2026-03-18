import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class SeparateCityAndStateInCompanyEmployee1772100000000
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar novos campos
        await queryRunner.addColumns("companyEmployees", [
            new TableColumn({
                name: "city",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "state",
                type: "varchar",
                isNullable: true,
            }),
        ]);

        // Remover campo antigo
        await queryRunner.dropColumn("companyEmployees", "location");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("companyEmployees", new TableColumn({
            name: "location",
            type: "varchar",
            isNullable: true,
        }));
        
        await queryRunner.dropColumn("companyEmployees", "city");
        await queryRunner.dropColumn("companyEmployees", "state");
    }
}
