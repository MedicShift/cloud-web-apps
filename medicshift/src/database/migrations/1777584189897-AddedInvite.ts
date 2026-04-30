import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedInvite1777584189897 implements MigrationInterface {
    name = 'AddedInvite1777584189897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_51c6e8cae3082ba8e9de50958ab"`);
        await queryRunner.query(`CREATE TYPE "public"."invites_role_enum" AS ENUM('admin', 'manager', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."invites_status_enum" AS ENUM('pending', 'accepted', 'expired')`);
        await queryRunner.query(`CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "email" character varying NOT NULL, "invitedBy" uuid NOT NULL, "role" "public"."invites_role_enum" NOT NULL DEFAULT 'user', "status" "public"."invites_status_enum" NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "acceptedAt" TIMESTAMP, CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "shifts" ADD "departmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "shifts" ADD CONSTRAINT "FK_7b61aa73032ba68c804cea5d4c2" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_9e4706c91f694baa7674ec3c1d5" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invites" ADD CONSTRAINT "FK_3e3a9f6a48aaa62ec27b89fa2ed" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_3e3a9f6a48aaa62ec27b89fa2ed"`);
        await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_9e4706c91f694baa7674ec3c1d5"`);
        await queryRunner.query(`ALTER TABLE "shifts" DROP CONSTRAINT "FK_7b61aa73032ba68c804cea5d4c2"`);
        await queryRunner.query(`ALTER TABLE "shifts" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "departmentId" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "invites"`);
        await queryRunner.query(`DROP TYPE "public"."invites_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."invites_role_enum"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_51c6e8cae3082ba8e9de50958ab" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
