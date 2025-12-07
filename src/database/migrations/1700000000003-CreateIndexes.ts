import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexes1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // User Subscriptions
    await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_user_id" ON "user_subscriptions"("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_status" ON "user_subscriptions"("status")`);

    // Devices
    await queryRunner.query(`CREATE INDEX "IDX_devices_user_id" ON "devices"("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_devices_device_id" ON "devices"("device_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_devices_status" ON "devices"("status")`);

    // Plant Species
    await queryRunner.query(`CREATE INDEX "IDX_plant_species_group_id" ON "plant_species"("group_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_plant_species_category" ON "plant_species"("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_plant_species_name" ON "plant_species"("name")`);

    // Plant Packages
    await queryRunner.query(`CREATE INDEX "IDX_plant_packages_category" ON "plant_packages"("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_plant_packages_popular" ON "plant_packages"("popular")`);

    // Plant Package Items
    await queryRunner.query(`CREATE INDEX "IDX_package_items_package_id" ON "plant_package_items"("package_id")`);

    // User Plant Selections
    await queryRunner.query(`CREATE INDEX "IDX_selections_user_id" ON "user_plant_selections"("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_selections_device_id" ON "user_plant_selections"("device_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_selections_active" ON "user_plant_selections"("active")`);

    // Sensor Readings
    await queryRunner.query(`CREATE INDEX "IDX_readings_device_id" ON "sensor_readings"("device_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_readings_timestamp" ON "sensor_readings"("timestamp")`);
    await queryRunner.query(`CREATE INDEX "IDX_readings_device_timestamp" ON "sensor_readings"("device_id", "timestamp")`);

    // Sensor Verifications
    await queryRunner.query(`CREATE INDEX "IDX_verifications_device_id" ON "sensor_verifications"("device_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_verifications_status" ON "sensor_verifications"("status")`);

    // User Actions
    await queryRunner.query(`CREATE INDEX "IDX_actions_user_id" ON "user_actions"("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_actions_device_id" ON "user_actions"("device_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_actions_selection_id" ON "user_actions"("selection_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_actions_action_date" ON "user_actions"("action_date")`);

    console.log('✅ Indexes created');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_subscriptions_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_subscriptions_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_devices_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_devices_device_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_devices_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_species_group_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_species_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_species_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_packages_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plant_packages_popular"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_package_items_package_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_selections_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_selections_device_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_selections_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_readings_device_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_readings_timestamp"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_readings_device_timestamp"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_verifications_device_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_verifications_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actions_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actions_device_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actions_selection_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_actions_action_date"`);
  }
}