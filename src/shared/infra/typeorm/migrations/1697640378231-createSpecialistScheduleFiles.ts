import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class createSpecialistScheduleFiles1697640378231
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "specialistScheduleFiles",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "specialistScheduleId",
                        type: "uuid",
                    },
                    {
                        name: "fileLink",
                        type: "varchar",
                    },
                    {
                        name: "fileName",
                        type: "varchar",
                    },
                    {
                        name: "fileType",
                        type: "varchar", // Assuming your enum maps to a string in the database
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKSpecialistScheduleFilesId",
                        referencedTableName: "specialistSchedule",
                        referencedColumnNames: ["id"],
                        columnNames: ["specialistScheduleId"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the "specialistschedulefiles" table if needed
        await queryRunner.dropTable("specialistschedulefiles");
    }
}

