import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMentoring1688065781157 implements MigrationInterface {
    /* 
      id?: string;
    title: string;
    date: string;
    mentor: string;
    linkMeet: string;
    vacancies: number;
    users: number;
    image: string;
    
    */

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "mentoring",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "date",
                        type: "date",
                    },
                    {
                        name: "mentor",
                        type: "varchar",
                    },
                    {
                        name: "linkMeet",
                        type: "varchar",
                    },
                    {
                        name: "vacancies",
                        type: "integer",
                    },
                    {
                        name: "users",
                        type: "integer",
                    },
                    {
                        name: "image",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "date",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

