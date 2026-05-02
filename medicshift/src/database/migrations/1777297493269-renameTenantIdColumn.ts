import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTenantIdColumn1777297493269 implements MigrationInterface {
  name = 'RenameTenantIdColumn1777297493269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_0ce987364b9a455af2a739558ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_08ac1923228419c9523bca473cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" RENAME COLUMN "hospitalId" TO "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" RENAME COLUMN "hospitalId" TO "tenantId"`,
    );
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "hospitalId"`);
    await queryRunner.query(
      `ALTER TABLE "schedules" DROP CONSTRAINT "FK_18016abbbedd8354ee4518cf0ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ALTER COLUMN "tenantId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ADD CONSTRAINT "FK_617394da01e48b2fea5dc80fe23" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_4e3e6dd2774dcd657b0fa029d7b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD CONSTRAINT "FK_18016abbbedd8354ee4518cf0ea" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedules" DROP CONSTRAINT "FK_18016abbbedd8354ee4518cf0ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_4e3e6dd2774dcd657b0fa029d7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_617394da01e48b2fea5dc80fe23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ALTER COLUMN "tenantId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD CONSTRAINT "FK_18016abbbedd8354ee4518cf0ea" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD "hospitalId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" RENAME COLUMN "tenantId" TO "hospitalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" RENAME COLUMN "tenantId" TO "hospitalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_08ac1923228419c9523bca473cc" FOREIGN KEY ("hospitalId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ADD CONSTRAINT "FK_0ce987364b9a455af2a739558ab" FOREIGN KEY ("hospitalId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
