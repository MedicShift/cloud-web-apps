import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchedule1778174190088 implements MigrationInterface {
    name = 'UpdateSchedule1778174190088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_19c54f24597b318be3892114c75" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_19c54f24597b318be3892114c75"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "userId" character varying NOT NULL`);
    }

}
