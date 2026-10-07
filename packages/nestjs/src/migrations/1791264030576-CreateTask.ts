import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTask1791264030576 implements MigrationInterface {
    name = 'CreateTask1791264030576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying(30) NOT NULL, "description" character varying(200) NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
