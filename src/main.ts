import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerConfigInit } from './config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until Winston is ready
  });
  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
   const logger = new Logger('Bootstrap');
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Add your frontend URLs
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );
  // API prefix
  // app.setGlobalPrefix('api');
  SwaggerConfigInit(app);
// Try to get DataSource injected by Nest/typeorm
  const dataSource = app.get(DataSource);
const configService = app.get(ConfigService);

  console.log('📦 Loaded ENV:');
  console.log('DATABASE_HOST =', configService.get('DATABASE_HOST'));
  console.log('DATABASE_PORT =', configService.get('DATABASE_PORT'));
  console.log('DATABASE_PASSWORD =', configService.get('DATABASE_PASSWORD'));
  console.log('DATABASE_USER =', configService.get('DATABASE_USER'));
  console.log('DATABASE_NAME =', configService.get('DATABASE_NAME'));
  console.log('NODE_ENV =', configService.get('NODE_ENV'));
  try {
    await dataSource.query('SELECT 1');
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`
    🌱 Plant Maintenance API is running!
    
    📡 API: http://localhost:3000
    📚 Swagger Docs:http://127.0.0.1:3000/swagger
    
    Environment: ${process.env.NODE_ENV || 'development'}
  `);
    // console.log(`connected`)
    // console.log(`swaager : http://127.0.0.1:3000/swagger`)
  });
}
bootstrap();
