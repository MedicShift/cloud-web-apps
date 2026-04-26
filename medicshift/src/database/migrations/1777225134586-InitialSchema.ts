import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777225134586 implements MigrationInterface {
    name = 'InitialSchema1777225134586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'NURSE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'NURSE', "hospitalId" uuid, "hashedRefreshToken" character varying, "failedLoginAttempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hospitals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying, "phone" character varying, "email" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_02738c80d71453bc3e369a01766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shifts_shifttype_enum" AS ENUM('MORNING', 'AFTERNOON', 'NIGHT')`);
        await queryRunner.query(`CREATE TABLE "shifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "shiftType" "public"."shifts_shifttype_enum" NOT NULL, "hospitalId" uuid NOT NULL, CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "hospitalId" uuid NOT NULL, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" date NOT NULL, "scheduleId" uuid NOT NULL, "userId" uuid NOT NULL, "shiftId" uuid NOT NULL, CONSTRAINT "PK_bfe848ea36c4b3d8a4b18ec82aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."schedules_status_enum" AS ENUM('DRAFT', 'GENERATING', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "startDate" date NOT NULL, "endDate" date NOT NULL, "status" "public"."schedules_status_enum" NOT NULL DEFAULT 'DRAFT', "hospitalId" uuid NOT NULL, "departmentId" uuid NOT NULL, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shifts" ADD CONSTRAINT "FK_08ac1923228419c9523bca473cc" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_0ce987364b9a455af2a739558ab" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" ADD CONSTRAINT "FK_bf3134da50d9e3b15dbee3d5b4a" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" ADD CONSTRAINT "FK_004267153afad8f57c7cf1d5746" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" ADD CONSTRAINT "FK_7c960b7cf8997e304659dda34c9" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_988d54f0e9799fe0584ad291f1d" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_51c6e8cae3082ba8e9de50958ab" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_51c6e8cae3082ba8e9de50958ab"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_988d54f0e9799fe0584ad291f1d"`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" DROP CONSTRAINT "FK_7c960b7cf8997e304659dda34c9"`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" DROP CONSTRAINT "FK_004267153afad8f57c7cf1d5746"`);
        await queryRunner.query(`ALTER TABLE "schedule_entries" DROP CONSTRAINT "FK_bf3134da50d9e3b15dbee3d5b4a"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_0ce987364b9a455af2a739558ab"`);
        await queryRunner.query(`ALTER TABLE "shifts" DROP CONSTRAINT "FK_08ac1923228419c9523bca473cc"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TYPE "public"."schedules_status_enum"`);
        await queryRunner.query(`DROP TABLE "schedule_entries"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "shifts"`);
        await queryRunner.query(`DROP TYPE "public"."shifts_shifttype_enum"`);
        await queryRunner.query(`DROP TABLE "hospitals"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
