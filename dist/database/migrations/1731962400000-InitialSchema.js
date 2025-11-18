"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1731962400000 = void 0;
class InitialSchema1731962400000 {
    name = 'InitialSchema1731962400000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "phone" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "plant" (
       "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "species" character varying NOT NULL,
        "description" text,
        "location" character varying,
        "plantedDate" date NOT NULL,
        "status" character varying NOT NULL DEFAULT 'active',
        "deviceId" character varying NOT NULL,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_plant_deviceId" UNIQUE ("deviceId"),
        CONSTRAINT "PK_plant" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "sensor_readings" (
        "id" SERIAL NOT NULL,
        "temperature" numeric(5,2) NOT NULL,
        "moisture" numeric(5,2) NOT NULL,
        "light" numeric(8,2) NOT NULL,
        "timestamp" TIMESTAMP NOT NULL,
        "plantId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sensor_readings" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "user_actions_actiontype_enum" AS ENUM(
        'watered', 'fertilized', 'pruned', 'soil_changed', 
        'relocated', 'pesticide_applied', 'other'
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "user_actions" (
        "id" SERIAL NOT NULL,
        "actionType" "user_actions_actiontype_enum" NOT NULL,
        "notes" text,
        "actionDate" TIMESTAMP NOT NULL,
        "plantId" integer NOT NULL,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_actions" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "plant" 
      ADD CONSTRAINT "FK_plant_userId" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "sensor_readings" 
      ADD CONSTRAINT "FK_sensor_readings_plantId" 
      FOREIGN KEY ("plantId") REFERENCES "plant"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "user_actions" 
      ADD CONSTRAINT "FK_user_actions_plantId" 
      FOREIGN KEY ("plantId") REFERENCES "plant"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "user_actions" 
      ADD CONSTRAINT "FK_user_actions_userId" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_sensor_readings_plantId_timestamp" 
      ON "sensor_readings" ("plantId", "timestamp")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_user_actions_plantId" 
      ON "user_actions" ("plantId")
    `);
        await queryRunner.query(`
      CREATE INDEX "IDX_plant_userId" 
      ON "plant" ("userId")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_userId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_actions_plantId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sensor_readings_plantId_timestamp"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "user_actions" DROP CONSTRAINT IF EXISTS "FK_user_actions_userId"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "user_actions" DROP CONSTRAINT IF EXISTS "FK_user_actions_plantId"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "sensor_readings" DROP CONSTRAINT IF EXISTS "FK_sensor_readings_plantId"`);
        await queryRunner.query(`ALTER TABLE IF EXISTS "plant" DROP CONSTRAINT IF EXISTS "FK_plant_userId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_actions"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "user_actions_actiontype_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sensor_readings"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "plant"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }
}
exports.InitialSchema1731962400000 = InitialSchema1731962400000;
//# sourceMappingURL=1731962400000-InitialSchema.js.map