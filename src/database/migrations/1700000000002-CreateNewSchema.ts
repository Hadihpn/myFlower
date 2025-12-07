import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewSchema1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Subscription Tiers
    await queryRunner.query(`
      CREATE TABLE "subscription_tiers" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(50) NOT NULL,
        "plant_slot_limit" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "billing_cycle" VARCHAR(20) DEFAULT 'monthly',
        "features" JSONB,
        "active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW()
      )
    `);

    // 2. User Subscriptions
    await queryRunner.query(`
      CREATE TABLE "user_subscriptions" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "tier_id" INTEGER NOT NULL,
        "status" VARCHAR(20) DEFAULT 'active',
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP,
        "auto_renew" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_user_subscriptions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_subscriptions_tier" FOREIGN KEY ("tier_id") REFERENCES "subscription_tiers"("id")
      )
    `);

    // 3. Devices
    await queryRunner.query(`
      CREATE TABLE "devices" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "device_id" VARCHAR(100) UNIQUE NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "location" VARCHAR(255),
        "status" VARCHAR(20) DEFAULT 'active',
        "token_hash" VARCHAR(255),
        "token_expires_at" TIMESTAMP,
        "last_seen" TIMESTAMP,
        "calibration" JSONB,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_devices_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 4. Plant Groups
    await queryRunner.query(`
      CREATE TABLE "plant_groups" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "category" VARCHAR(50),
        "difficulty" VARCHAR(20),
        "thresholds" JSONB NOT NULL,
        "care_instructions" JSONB,
        "image_url" VARCHAR(500),
        "active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW()
      )
    `);

    // 5. Plant Species
    await queryRunner.query(`
      CREATE TABLE "plant_species" (
        "id" SERIAL PRIMARY KEY,
        "group_id" INTEGER,
        "name" VARCHAR(255) NOT NULL,
        "scientific_name" VARCHAR(255),
        "common_names" TEXT[],
        "category" VARCHAR(50),
        "difficulty" VARCHAR(20),
        "thresholds" JSONB NOT NULL,
        "watering" JSONB,
        "fertilization" JSONB,
        "growth_info" JSONB,
        "harvest_info" JSONB,
        "common_problems" JSONB,
        "companion_plants" TEXT[],
        "avoid_plants" TEXT[],
        "toxicity" JSONB,
        "tips" TEXT[],
        "image_url" VARCHAR(500),
        "active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_plant_species_group" FOREIGN KEY ("group_id") REFERENCES "plant_groups"("id") ON DELETE SET NULL
      )
    `);

    // 6. Plant Packages
    await queryRunner.query(`
      CREATE TABLE "plant_packages" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "category" VARCHAR(50),
        "difficulty" VARCHAR(20),
        "plant_count" INTEGER NOT NULL,
        "thresholds" JSONB NOT NULL,
        "price" DECIMAL(10,2),
        "image_url" VARCHAR(500),
        "popular" BOOLEAN DEFAULT false,
        "active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW()
      )
    `);

    // 7. Plant Package Items
    await queryRunner.query(`
      CREATE TABLE "plant_package_items" (
        "id" SERIAL PRIMARY KEY,
        "package_id" INTEGER NOT NULL,
        "plant_species_id" INTEGER NOT NULL,
        "position" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_package_items_package" FOREIGN KEY ("package_id") REFERENCES "plant_packages"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_package_items_species" FOREIGN KEY ("plant_species_id") REFERENCES "plant_species"("id") ON DELETE CASCADE,
        UNIQUE("package_id", "plant_species_id")
      )
    `);

    // 8. User Plant Selections
    await queryRunner.query(`
      CREATE TABLE "user_plant_selections" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "device_id" INTEGER NOT NULL,
        "package_id" INTEGER,
        "plant_species_id" INTEGER,
        "nickname" VARCHAR(255),
        "planted_date" DATE,
        "location" VARCHAR(255),
        "notes" TEXT,
        "active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_selections_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_selections_device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_selections_package" FOREIGN KEY ("package_id") REFERENCES "plant_packages"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_selections_species" FOREIGN KEY ("plant_species_id") REFERENCES "plant_species"("id") ON DELETE SET NULL,
        CONSTRAINT "CHK_package_or_species" CHECK (
          (package_id IS NOT NULL AND plant_species_id IS NULL) OR 
          (package_id IS NULL AND plant_species_id IS NOT NULL)
        )
      )
    `);

    // 9. Sensor Readings
    await queryRunner.query(`
      CREATE TABLE "sensor_readings" (
        "id" SERIAL PRIMARY KEY,
        "device_id" INTEGER NOT NULL,
        "temperature" DECIMAL(5,2) NOT NULL,
        "moisture" DECIMAL(5,2) NOT NULL,
        "light" DECIMAL(8,2) NOT NULL,
        "humidity" DECIMAL(5,2),
        "timestamp" TIMESTAMP NOT NULL,
        "verified" BOOLEAN DEFAULT false,
        "anomaly" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_readings_device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE
      )
    `);

    // 10. Sensor Verifications
    await queryRunner.query(`
      CREATE TABLE "sensor_verifications" (
        "id" SERIAL PRIMARY KEY,
        "device_id" INTEGER NOT NULL,
        "trigger_reading_id" INTEGER NOT NULL,
        "status" VARCHAR(20) DEFAULT 'pending',
        "change_type" VARCHAR(50),
        "verification_readings" JSONB,
        "confirmed" BOOLEAN,
        "confidence" VARCHAR(20),
        "requested_at" TIMESTAMP NOT NULL,
        "completed_at" TIMESTAMP,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_verifications_device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_verifications_reading" FOREIGN KEY ("trigger_reading_id") REFERENCES "sensor_readings"("id") ON DELETE CASCADE
      )
    `);

    // 11. User Actions
    await queryRunner.query(`
      CREATE TYPE "action_type_enum" AS ENUM(
        'watered', 'fertilized', 'pruned', 'soil_changed', 
        'relocated', 'pesticide_applied', 'harvested', 'other'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_actions" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "device_id" INTEGER NOT NULL,
        "selection_id" INTEGER NOT NULL,
        "action_type" action_type_enum NOT NULL,
        "notes" TEXT,
        "action_date" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_actions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_actions_device" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_actions_selection" FOREIGN KEY ("selection_id") REFERENCES "user_plant_selections"("id") ON DELETE CASCADE
      )
    `);

    console.log('✅ New schema created');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_actions" CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS "action_type_enum" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_verifications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_readings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_plant_selections" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plant_package_items" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plant_packages" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plant_species" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plant_groups" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "devices" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_subscriptions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_tiers" CASCADE`);
  }
}