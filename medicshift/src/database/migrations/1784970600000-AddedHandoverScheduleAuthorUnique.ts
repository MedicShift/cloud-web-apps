import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHandoverScheduleAuthorUnique1784970600000 implements MigrationInterface {
  name = 'AddedHandoverScheduleAuthorUnique1784970600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover" ADD CONSTRAINT "UQ_handover_tenant_schedule_author" UNIQUE ("tenantId", "scheduleId", "authorId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover" DROP CONSTRAINT "UQ_handover_tenant_schedule_author"`,
    );
  }
}
