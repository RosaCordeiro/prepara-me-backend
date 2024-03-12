import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMaterialDownload1700673619966 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "material_download",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "material_id",
                        type: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                    },
                    {
                        name: "phone",
                        type: "varchar",
                    },
                    {
                        name: "company",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "position",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKMaterialDownload",
                        referencedTableName: "material",
                        referencedColumnNames: ["id"],
                        columnNames: ["material_id"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
