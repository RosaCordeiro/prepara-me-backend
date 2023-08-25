import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createCompanyPage1692888558439 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "companyPage",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "companyId",
                        type: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "vacancies",
                        type: "integer",
                    },
                    {
                        name: "expirationDate",
                        type: "timestamp",
                    },
                    {
                        name: "logo",
                        type: "varchar",
                    },
                    {
                        name: "text",
                        type: "varchar",
                    },
                    {
                        name: "backgroundColor",
                        type: "varchar",
                    },
                    {
                        name: "containerColor",
                        type: "varchar",
                    },
                    {
                        name: "clockColor",
                        type: "varchar",
                    },
                    {
                        name: "textColor",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKCompanyPage",
                        referencedTableName: "companies",
                        referencedColumnNames: ["id"],
                        columnNames: ["companyId"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
