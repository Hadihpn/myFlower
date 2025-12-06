  // import { ConfigService } from '@nestjs/config';
  // import { TypeOrmModuleOptions } from '@nestjs/typeorm';

  // export const getDatabaseConfig = (
  //   configService: ConfigService,
  // ): TypeOrmModuleOptions => ({
  //   type: 'postgres',
  //   host: configService.get('DATABASE_HOST'),
  //   port: configService.get('DATABASE_PORT'),
  //   username: configService.get('DATABASE_USER'),
  //   password: configService.get('DATABASE_PASSWORD'),
  //   database: configService.get('DATABASE_NAME'),
  //   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  //   synchronize: false, // Set to false in production!
  //   logging: true,
  // });

  import { TypeOrmModuleOptions } from '@nestjs/typeorm';
  import { ConfigService } from '@nestjs/config';
  import { DataSource, DataSourceOptions } from 'typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // 💡 Check for a single DATABASE_URL environment variable first
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl, // Use the single connection URL
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: configService.get('NODE_ENV') !== 'production',
      logging: configService.get('NODE_ENV') === 'development',
    };
  }

  // Fallback to the separate variables (good for local development)
  return {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
  };
};
  // DataSource for migrations
  export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    // host: process.env.DATABASE_HOST || 'localhost',
    // port: +process.env.DATABASE_PORT || 5432,
    // username: process.env.DATABASE_USER || 'postgres',
    // password: process.env.DATABASE_PASSWORD || 'password',
    // database: process.env.DATABASE_NAME || 'plant_maintenance',
    url:"postgresql://postgres.ujffaxtgnzpefetdbkrp:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
  };

  const dataSource = new DataSource(dataSourceOptions);
  export default dataSource;
