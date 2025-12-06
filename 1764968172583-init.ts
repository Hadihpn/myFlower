import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1764968172583 implements MigrationInterface {
    name = 'Init1764968172583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_readings" DROP CONSTRAINT "FK_sensor_readings_plantId"`);
        await queryRunner.query(`ALTER TABLE "plant" DROP CONSTRAINT "FK_plant_userId"`);
        await queryRunner.query(`ALTER TABLE "user_actions" DROP CONSTRAINT "FK_user_actions_plantId"`);
        await queryRunner.query(`ALTER TABLE "user_actions" DROP CONSTRAINT "FK_user_actions_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_sensor_readings_plantId_timestamp"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_plant_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_actions_plantId"`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updatedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ef248d6ad1dd86de464313cac8" ON "sensor_readings" ("plantId", "timestamp") `);
        await queryRunner.query(`ALTER TABLE "sensor_readings" ADD CONSTRAINT "FK_12b01dda349fe60667d7bac67ff" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plant" ADD CONSTRAINT "FK_ab082df81848f48f1d1f64a9cf8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions" ADD CONSTRAINT "FK_166379542a0e7b539166083edb3" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions" ADD CONSTRAINT "FK_e65a8053e5b02e0b89947b6bac9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_actions" DROP CONSTRAINT "FK_e65a8053e5b02e0b89947b6bac9"`);
        await queryRunner.query(`ALTER TABLE "user_actions" DROP CONSTRAINT "FK_166379542a0e7b539166083edb3"`);
        await queryRunner.query(`ALTER TABLE "plant" DROP CONSTRAINT "FK_ab082df81848f48f1d1f64a9cf8"`);
        await queryRunner.query(`ALTER TABLE "sensor_readings" DROP CONSTRAINT "FK_12b01dda349fe60667d7bac67ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef248d6ad1dd86de464313cac8"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "updatedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plant" ALTER COLUMN "createdAt" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_user_actions_plantId" ON "user_actions" ("plantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_plant_userId" ON "plant" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_sensor_readings_plantId_timestamp" ON "sensor_readings" ("timestamp", "plantId") `);
        await queryRunner.query(`ALTER TABLE "user_actions" ADD CONSTRAINT "FK_user_actions_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_actions" ADD CONSTRAINT "FK_user_actions_plantId" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plant" ADD CONSTRAINT "FK_plant_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_readings" ADD CONSTRAINT "FK_sensor_readings_plantId" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
