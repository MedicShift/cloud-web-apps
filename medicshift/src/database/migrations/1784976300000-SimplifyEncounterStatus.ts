import { MigrationInterface, QueryRunner } from 'typeorm';

export class SimplifyEncounterStatus1784976300000 implements MigrationInterface {
  name = 'SimplifyEncounterStatus1784976300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."encounter_status_enum" RENAME TO "encounter_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."encounter_status_enum" AS ENUM('admitted', 'discharged')`,
    );
    await queryRunner.query(
      `ALTER TABLE "encounter" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "encounter" ALTER COLUMN "status" TYPE "public"."encounter_status_enum" USING (CASE WHEN "status"::"text" = 'discharged' THEN 'discharged' ELSE 'admitted' END)::"public"."encounter_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."encounter_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."encounter_status_enum" RENAME TO "encounter_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."encounter_status_enum" AS ENUM('pending', 'active', 'transferred', 'discharged', 'left_ama', 'deceased', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "encounter" ALTER COLUMN "status" TYPE "public"."encounter_status_enum" USING (CASE WHEN "status"::"text" = 'admitted' THEN 'active' ELSE "status"::"text" END)::"public"."encounter_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."encounter_status_enum_old"`);
  }
}
