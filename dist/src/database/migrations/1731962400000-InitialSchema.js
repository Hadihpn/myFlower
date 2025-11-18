"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1731962400000 = void 0;
class InitialSchema1731962400000 {
    name = 'InitialSchema1731962400000';
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE IF NOT EXISTS "user" ("id" SERIAL NOT NULL PRIMARY KEY, "email" character varying NOT NULL UNIQUE, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS "plant" ("id" SERIAL NOT NULL PRIMARY KEY, "name" character varying NOT NULL, "species" character varying NOT NULL, "description" text, "location" character varying, "plantedDate" date NOT NULL, "status" character varying NOT NULL DEFAULT \'active\', "deviceId" character varying NOT NULL UNIQUE, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS "sensor_readings" ("id" SERIAL NOT NULL PRIMARY KEY, "temperature" numeric(5,2) NOT NULL, "moisture" numeric(5,2) NOT NULL, "light" numeric(8,2) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "plantId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now())');
        const typeExists = await queryRunner.query('SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = \'user_actions_actiontype_enum\')');
        if (!typeExists[0].exists) {
            await queryRunner.query('CREATE TYPE "user_actions_actiontype_enum" AS ENUM(\'watered\', \'fertilized\', \'pruned\', \'soil_changed\', \'relocated\', \'pesticide_applied\', \'other\')');
        }
        await queryRunner.query('CREATE TABLE IF NOT EXISTS "user_actions" ("id" SERIAL NOT NULL PRIMARY KEY, "actionType" "user_actions_actiontype_enum" NOT NULL, "notes" text, "actionDate" TIMESTAMP NOT NULL, "plantId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now())');
        const plantFkExists = await queryRunner.query('SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = \'plant\' AND constraint_name = \'FK_plant_userId\'');
        if (plantFkExists.length === 0) {
            await queryRunner.query('ALTER TABLE "plant" ADD CONSTRAINT "FK_plant_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE');
        }
        const sensorFkExists = await queryRunner.query('SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = \'sensor_readings\' AND constraint_name = \'FK_sensor_readings_plantId\'');
        if (sensorFkExists.length === 0) {
            await queryRunner.query('ALTER TABLE "sensor_readings" ADD CONSTRAINT "FK_sensor_readings_plantId" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE');
        }
        const userActionPlantFkExists = await queryRunner.query('SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = \'user_actions\' AND constraint_name = \'FK_user_actions_plantId\'');
        if (userActionPlantFkExists.length === 0) {
            await queryRunner.query('ALTER TABLE "user_actions" ADD CONSTRAINT "FK_user_actions_plantId" FOREIGN KEY ("plantId") REFERENCES "plant"("id") ON DELETE CASCADE');
        }
        const userActionUserFkExists = await queryRunner.query('SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = \'user_actions\' AND constraint_name = \'FK_user_actions_userId\'');
        if (userActionUserFkExists.length === 0) {
            await queryRunner.query('ALTER TABLE "user_actions" ADD CONSTRAINT "FK_user_actions_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE');
        }
        const sensorIndexExists = await queryRunner.query('SELECT indexname FROM pg_indexes WHERE indexname = \'IDX_sensor_readings_plantId_timestamp\'');
        if (sensorIndexExists.length === 0) {
            await queryRunner.query('CREATE INDEX "IDX_sensor_readings_plantId_timestamp" ON "sensor_readings" ("plantId", "timestamp")');
        }
        const userActionIndexExists = await queryRunner.query('SELECT indexname FROM pg_indexes WHERE indexname = \'IDX_user_actions_plantId\'');
        if (userActionIndexExists.length === 0) {
            await queryRunner.query('CREATE INDEX "IDX_user_actions_plantId" ON "user_actions" ("plantId")');
        }
        const plantIndexExists = await queryRunner.query('SELECT indexname FROM pg_indexes WHERE indexname = \'IDX_plant_userId\'');
        if (plantIndexExists.length === 0) {
            await queryRunner.query('CREATE INDEX "IDX_plant_userId" ON "plant" ("userId")');
        }
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX IF EXISTS "IDX_plant_userId"');
        await queryRunner.query('DROP INDEX IF EXISTS "IDX_user_actions_plantId"');
        await queryRunner.query('DROP INDEX IF EXISTS "IDX_sensor_readings_plantId_timestamp"');
        await queryRunner.query('ALTER TABLE IF EXISTS "user_actions" DROP CONSTRAINT IF EXISTS "FK_user_actions_userId"');
        await queryRunner.query('ALTER TABLE IF EXISTS "user_actions" DROP CONSTRAINT IF EXISTS "FK_user_actions_plantId"');
        await queryRunner.query('ALTER TABLE IF EXISTS "sensor_readings" DROP CONSTRAINT IF EXISTS "FK_sensor_readings_plantId"');
        await queryRunner.query('ALTER TABLE IF EXISTS "plant" DROP CONSTRAINT IF EXISTS "FK_plant_userId"');
        await queryRunner.query('DROP TABLE IF EXISTS "user_actions"');
        await queryRunner.query('DROP TYPE IF EXISTS "user_actions_actiontype_enum"');
        await queryRunner.query('DROP TABLE IF EXISTS "sensor_readings"');
        await queryRunner.query('DROP TABLE IF EXISTS "plant"');
        await queryRunner.query('DROP TABLE IF EXISTS "user"');
    }
}
exports.InitialSchema1731962400000 = InitialSchema1731962400000;
//# sourceMappingURL=1731962400000-InitialSchema.js.map