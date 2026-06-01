import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMaterial1700589450355 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "material",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "slug",
                        type: "varchar",
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "backgroundColor",
                        type: "varchar",
                    },
                    {
                        name: "file",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("material");
    }
}
