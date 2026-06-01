import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createSpecialistScheduleCancel1704375935495
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "specialistScheduleCancel",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },

                    {
                        name: "dateSchedule",
                        type: "timestamp",
                    },
                    {
                        name: "specialistId",
                        type: "uuid",
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "productId",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKSpecialistScheduleCancel",
                        referencedTableName: "specialists",
                        referencedColumnNames: ["id"],
                        columnNames: ["specialistId"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL",
                    },
                    {
                        name: "FKUserSpecialistScheduleCancel",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["userId"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL",
                    },
                    {
                        name: "FKProductSpecialistScheduleCancel",
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        columnNames: ["productId"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
