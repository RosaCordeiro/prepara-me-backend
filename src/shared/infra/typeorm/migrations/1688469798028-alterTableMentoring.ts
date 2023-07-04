import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class alterTableMentoring1688469798028 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "mentoring",
            "date",
            new TableColumn({
                name: "date",
                type: "timestamp",
                isNullable: true,
            })
        );

        /* change column created_at */
        await queryRunner.changeColumn(
            "mentoring",
            "created_at",
            new TableColumn({
                name: "created_at",
                type: "timestamp",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "mentoring",
            "date",
            new TableColumn({
                name: "date",
                type: "date",
                isNullable: true,
            })
        );

        /* change column created_at */
        await queryRunner.changeColumn(
            "mentoring",
            "created_at",
            new TableColumn({
                name: "created_at",
                type: "date",
                isNullable: true,
            })
        );
    }
}

