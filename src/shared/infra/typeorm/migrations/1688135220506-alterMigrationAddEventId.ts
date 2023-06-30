import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class alterMigrationAddEventId1688135220506
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "mentoring",
            new TableColumn({
                name: "eventId",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("mentoring", "eventId");
    }
}

