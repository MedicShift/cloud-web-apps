import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentHeadId1777638806856 implements MigrationInterface {
    name = 'AddDepartmentHeadId1777638806856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" ADD "departmentHeadId" uuid`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_deee75d312c82e6799e35bcde6a" FOREIGN KEY ("departmentHeadId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_deee75d312c82e6799e35bcde6a"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP COLUMN "departmentHeadId"`);
    }

}
