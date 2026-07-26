import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHandoverEntriesTenantFk1784834364628 implements MigrationInterface {
  name = 'AddedHandoverEntriesTenantFk1784834364628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" ADD CONSTRAINT "FK_abc8a0ff0412b8fe348400da411" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "handover_entries" DROP CONSTRAINT "FK_abc8a0ff0412b8fe348400da411"`,
    );
  }
}
