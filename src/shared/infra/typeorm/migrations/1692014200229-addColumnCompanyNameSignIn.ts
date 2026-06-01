import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addColumnCompanyNameSignIn1692014200229
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "companyNameSignIn",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
