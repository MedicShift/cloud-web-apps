import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEncounters1784677340791 implements MigrationInterface {
    name = 'AddedEncounters1784677340791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."encounter_encountertype_enum" AS ENUM('inpatient', 'outpatient', 'ed')`);
        await queryRunner.query(`CREATE TYPE "public"."encounter_status_enum" AS ENUM('active', 'discharged')`);
        await queryRunner.query(`CREATE TABLE "encounter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "patientId" uuid NOT NULL, "departmentId" uuid NOT NULL, "encounterType" "public"."encounter_encountertype_enum" NOT NULL, "status" "public"."encounter_status_enum" NOT NULL, "bedNumber" character varying NOT NULL, "admittedAt" TIMESTAMP NOT NULL, "dischargedAt" TIMESTAMP, CONSTRAINT "PK_1cf9e15e693ff9f0ef9b9061372" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_40a00ef8dafa28caf149827bf74" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_a9c05100cb3647a5660d1c4c20d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_3c2a6bda4c75ce8c81ed50b63e9" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_3c2a6bda4c75ce8c81ed50b63e9"`);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_a9c05100cb3647a5660d1c4c20d"`);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_40a00ef8dafa28caf149827bf74"`);
        await queryRunner.query(`DROP TABLE "encounter"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."encounter_encountertype_enum"`);
    }

}
