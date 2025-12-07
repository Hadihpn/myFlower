import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOldSchema1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop all old tables
    await queryRunner.query(`DROP TABLE IF EXISTS "user_actions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sensor_readings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plants" CASCADE`);
    
    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "user_actions_actiontype_enum" CASCADE`);
    
    console.log('✅ Old schema dropped');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('⚠️ Cannot rollback - old schema was dropped');
  }
}