import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addReasonSpecialistScheduleCancel1715879927653
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("specialistScheduleCancel", [
            new TableColumn({
                name: "reason",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
