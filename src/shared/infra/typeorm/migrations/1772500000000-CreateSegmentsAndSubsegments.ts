import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateSegmentsAndSubsegments1772500000000
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "segments",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true },
                    { name: "name", type: "varchar" },
                ],
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "subsegments",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true },
                    { name: "name", type: "varchar" },
                    { name: "segmentId", type: "uuid" },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "subsegments",
            new TableForeignKey({
                name: "FKSubsegmentsSegment",
                referencedTableName: "segments",
                referencedColumnNames: ["id"],
                columnNames: ["segmentId"],
                onDelete: "RESTRICT",
                onUpdate: "CASCADE",
            })
        );

        await queryRunner.addColumn(
            "companies",
            new TableColumn({
                name: "segmentId",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "companies",
            new TableColumn({
                name: "subsegmentId",
                type: "uuid",
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            "companies",
            new TableForeignKey({
                name: "FKCompaniesSegment",
                referencedTableName: "segments",
                referencedColumnNames: ["id"],
                columnNames: ["segmentId"],
                onDelete: "RESTRICT",
                onUpdate: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "companies",
            new TableForeignKey({
                name: "FKCompaniesSubsegment",
                referencedTableName: "subsegments",
                referencedColumnNames: ["id"],
                columnNames: ["subsegmentId"],
                onDelete: "RESTRICT",
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const companiesTable = await queryRunner.getTable("companies");
        for (const name of ["FKCompaniesSubsegment", "FKCompaniesSegment"]) {
            const fk = companiesTable?.foreignKeys.find((f) => f.name === name);
            if (fk) await queryRunner.dropForeignKey("companies", fk);
        }
        await queryRunner.dropColumn("companies", "subsegmentId");
        await queryRunner.dropColumn("companies", "segmentId");

        const subTable = await queryRunner.getTable("subsegments");
        const subFk = subTable?.foreignKeys.find(
            (f) => f.name === "FKSubsegmentsSegment"
        );
        if (subFk) await queryRunner.dropForeignKey("subsegments", subFk);
        await queryRunner.dropTable("subsegments");
        await queryRunner.dropTable("segments");
    }
}
