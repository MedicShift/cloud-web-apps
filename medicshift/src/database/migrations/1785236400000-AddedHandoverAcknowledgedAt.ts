import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHandoverAcknowledgedAt1785236400000 implements MigrationInterface {
  name = 'AddedHandoverAcknowledgedAt1785236400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover" ADD "acknowledgedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."handover_status_enum" RENAME TO "handover_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."handover_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'ACCEPTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" TYPE "public"."handover_status_enum" USING "status"::"text"::"public"."handover_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."handover_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."handover_status_enum_old" AS ENUM('DRAFT', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" TYPE "public"."handover_status_enum_old" USING "status"::"text"::"public"."handover_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."handover_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."handover_status_enum_old" RENAME TO "handover_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" DROP COLUMN "acknowledgedAt"`,
    );
  }
}
