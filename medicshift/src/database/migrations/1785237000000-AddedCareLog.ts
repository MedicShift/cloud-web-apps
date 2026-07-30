import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCareLog1785237000000 implements MigrationInterface {
  name = 'AddedCareLog1785237000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "care_log" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "handoverEntryId" uuid NOT NULL,
        "encounterId" uuid NOT NULL,
        "category" character varying(20) NOT NULL,
        "description" text NOT NULL,
        "scheduledAt" TIMESTAMP(0) WITHOUT TIME ZONE,
        "recordedAt" TIMESTAMP(0) WITHOUT TIME ZONE,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_care_log_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_care_log_category" CHECK ("category" IN ('VITALS','LABS','ORDERS','COMFORT','IV')),
        CONSTRAINT "CHK_care_log_status" CHECK ("status" IN ('DONE','PENDING','NEEDS ATTENTION'))
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_log" ADD CONSTRAINT "care_log_handoverentryid_foreign" FOREIGN KEY ("handoverEntryId") REFERENCES "handover_entries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_log" ADD CONSTRAINT "care_log_encounterid_foreign" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_log" ADD CONSTRAINT "care_log_tenantid_foreign" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "care_log" DROP CONSTRAINT "care_log_tenantid_foreign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_log" DROP CONSTRAINT "care_log_encounterid_foreign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_log" DROP CONSTRAINT "care_log_handoverentryid_foreign"`,
    );
    await queryRunner.query(`DROP TABLE "care_log"`);
  }
}
