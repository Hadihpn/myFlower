import AppDataSource from './src/ormconfig';

async function cleanup() {
  await AppDataSource.initialize();
  
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    console.log('Cleaning up database...');
    
    await queryRunner.query('DROP TABLE IF EXISTS "user_actions" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "sensor_readings" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "plant" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "user" CASCADE');
    await queryRunner.query('DROP TYPE IF EXISTS "user_actions_actiontype_enum"');
    
    console.log('Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

cleanup();
