import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createClicksCount1687960902758 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "click_count",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "click_name_id",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "date",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKClickCountClickNames",
                        referencedTableName: "click_names",
                        referencedColumnNames: ["id"],
                        columnNames: ["click_name_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

