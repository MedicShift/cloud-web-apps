import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTenant1777232308649 implements MigrationInterface {
  name = 'AddedTenant1777232308649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_0ce987364b9a455af2a739558ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_08ac1923228419c9523bca473cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" DROP CONSTRAINT "FK_988d54f0e9799fe0584ad291f1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_entries" DROP CONSTRAINT "FK_bf3134da50d9e3b15dbee3d5b4a"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenants_tenanttype_enum" AS ENUM('hospital', 'school')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "tenantType" "public"."tenants_tenanttype_enum" NOT NULL DEFAULT 'hospital', "adminEmail" character varying, "address" character varying, "phone" character varying, "plan" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "renewalDate" TIMESTAMP, "userCount" integer NOT NULL DEFAULT '0', "openRequests" integer, CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "shifts" DROP COLUMN "shiftType"`);
    await queryRunner.query(`DROP TYPE "public"."shifts_shifttype_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hospitalId"`);
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "startDate"`);
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "tenantId" uuid`);
    await queryRunner.query(`ALTER TABLE "users" ADD "departmentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordHash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "lastLoginAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD "shiftId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "schedules" ADD "date" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "schedules" ADD "tenantId" uuid`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "departments" ADD CONSTRAINT "FK_0ce987364b9a455af2a739558ab" FOREIGN KEY ("hospitalId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_08ac1923228419c9523bca473cc" FOREIGN KEY ("hospitalId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_554d853741f2083faaa5794d2ae" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
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
      `ALTER TABLE "users" DROP CONSTRAINT "FK_554d853741f2083faaa5794d2ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" DROP CONSTRAINT "FK_08ac1923228419c9523bca473cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_0ce987364b9a455af2a739558ab"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum_old" AS ENUM('ADMIN', 'MANAGER', 'NURSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'NURSE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "date"`);
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "shiftId"`);
    await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLoginAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "departmentId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD "endDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "hospitalId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."shifts_shifttype_enum" AS ENUM('MORNING', 'AFTERNOON', 'NIGHT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD "shiftType" "public"."shifts_shifttype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ADD "description" character varying`,
    );
    await queryRunner.query(`DROP TABLE "tenants"`);
    await queryRunner.query(`DROP TYPE "public"."tenants_tenanttype_enum"`);
    await queryRunner.query(
      `ALTER TABLE "schedule_entries" ADD CONSTRAINT "FK_bf3134da50d9e3b15dbee3d5b4a" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD CONSTRAINT "FK_988d54f0e9799fe0584ad291f1d" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shifts" ADD CONSTRAINT "FK_08ac1923228419c9523bca473cc" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ADD CONSTRAINT "FK_0ce987364b9a455af2a739558ab" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
