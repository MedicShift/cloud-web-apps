import { MigrationInterface, QueryRunner } from "typeorm";

export class FixScheduleShiftIdType1778576250480 implements MigrationInterface {
    name = 'FixScheduleShiftIdType1778576250480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "shiftId"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "shiftId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_9f473001b5432ed29c44b898d0a" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_9f473001b5432ed29c44b898d0a"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "shiftId"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "shiftId" character varying NOT NULL`);
    }

}
