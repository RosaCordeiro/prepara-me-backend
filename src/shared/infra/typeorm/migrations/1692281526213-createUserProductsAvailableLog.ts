import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUserProductsAvailableLog1692281526213
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "userProductsAvailableLog",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "userProductsAvailableId",
                        type: "uuid",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "productIdNew",
                        type: "uuid",
                    },
                    {
                        name: "productIdOld",
                        type: "uuid",
                    },
                    {
                        name: "availableQuantity",
                        type: "integer",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKUserProductsAvailableLog",
                        referencedTableName: "userProductsAvailable",
                        referencedColumnNames: ["id"],
                        columnNames: ["userProductsAvailableId"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
