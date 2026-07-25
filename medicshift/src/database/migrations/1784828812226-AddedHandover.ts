import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedHandover1784828812226 implements MigrationInterface {
    name = 'AddedHandover1784828812226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."handover_status_enum" AS ENUM('DRAFT', 'SUBMITTED')`);
        await queryRunner.query(`CREATE TABLE "handover" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "scheduleId" uuid NOT NULL, "authorId" uuid NOT NULL, "recipientId" uuid, "status" "public"."handover_status_enum" NOT NULL DEFAULT 'DRAFT', "submittedAt" TIMESTAMP, CONSTRAINT "PK_15e64c0391cf9fb9278f297691f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "handover_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "handoverId" uuid NOT NULL, "encounterId" uuid NOT NULL, "situation" character varying NOT NULL, "background" character varying NOT NULL, "assessment" character varying NOT NULL, "recommendation" character varying NOT NULL, CONSTRAINT "UQ_f073e9abfec12c2d40211d68746" UNIQUE ("handoverId", "encounterId"), CONSTRAINT "PK_f30bc946336f2eb28f5895d96d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."encounter_encountertype_enum" RENAME TO "encounter_encountertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."encounter_encountertype_enum" AS ENUM('admission', 'consultation', 'observation', 'emergency', 'day_case', 'outpatient')`);
        await queryRunner.query(`ALTER TABLE "encounter" ALTER COLUMN "encounterType" TYPE "public"."encounter_encountertype_enum" USING "encounterType"::"text"::"public"."encounter_encountertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_encountertype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."encounter_status_enum" RENAME TO "encounter_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."encounter_status_enum" AS ENUM('pending', 'active', 'transferred', 'discharged', 'left_ama', 'deceased', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "encounter" ALTER COLUMN "status" TYPE "public"."encounter_status_enum" USING "status"::"text"::"public"."encounter_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "handover" ADD CONSTRAINT "FK_7809036f6b20e8e4b1727c624ac" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "handover_entries" ADD CONSTRAINT "FK_3f960a7350e333f8e1780a9bf94" FOREIGN KEY ("handoverId") REFERENCES "handover"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "handover_entries" DROP CONSTRAINT "FK_3f960a7350e333f8e1780a9bf94"`);
        await queryRunner.query(`ALTER TABLE "handover" DROP CONSTRAINT "FK_7809036f6b20e8e4b1727c624ac"`);
        await queryRunner.query(`CREATE TYPE "public"."encounter_status_enum_old" AS ENUM('active', 'discharged')`);
        await queryRunner.query(`ALTER TABLE "encounter" ALTER COLUMN "status" TYPE "public"."encounter_status_enum_old" USING "status"::"text"::"public"."encounter_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."encounter_status_enum_old" RENAME TO "encounter_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."encounter_encountertype_enum_old" AS ENUM('inpatient', 'outpatient', 'ed')`);
        await queryRunner.query(`ALTER TABLE "encounter" ALTER COLUMN "encounterType" TYPE "public"."encounter_encountertype_enum_old" USING "encounterType"::"text"::"public"."encounter_encountertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_encountertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."encounter_encountertype_enum_old" RENAME TO "encounter_encountertype_enum"`);
        await queryRunner.query(`DROP TABLE "handover_entries"`);
        await queryRunner.query(`DROP TABLE "handover"`);
        await queryRunner.query(`DROP TYPE "public"."handover_status_enum"`);
    }

}
