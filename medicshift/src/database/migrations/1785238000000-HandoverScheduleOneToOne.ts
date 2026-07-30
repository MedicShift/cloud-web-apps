import { MigrationInterface, QueryRunner } from 'typeorm';

export class HandoverScheduleOneToOne1785238000000 implements MigrationInterface {
  name = 'HandoverScheduleOneToOne1785238000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover" DROP CONSTRAINT "UQ_handover_tenant_schedule_author"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ADD CONSTRAINT "UQ_handover_tenant_schedule" UNIQUE ("tenantId", "scheduleId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover" DROP CONSTRAINT "UQ_handover_tenant_schedule"`,
    );
    await queryRunner.query(
      `ALTER TABLE "handover" ADD CONSTRAINT "UQ_handover_tenant_schedule_author" UNIQUE ("tenantId", "scheduleId", "authorId")`,
    );
  }
}
