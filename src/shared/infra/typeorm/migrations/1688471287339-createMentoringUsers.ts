import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMentoringUsers1688471287339 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "mentoringUsers",
                columns: [
                    {
                        name: "mentoringId",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["mentoringId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "mentoring",
                    },
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

