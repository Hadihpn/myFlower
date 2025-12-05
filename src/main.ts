import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerConfigInit } from './config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
