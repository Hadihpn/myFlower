import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { FlowerModule } from './modules/flower/flower.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import { UserModule } from './modules/users/user.module';
import { SensorReadingsModule } from './modules/sensor-readings/sensor-readings.module';
import { getDatabaseConfig } from './config/db.config';
import { AdviceModule } from './modules/advice/advice.module';
import { UserActionsModule } from './modules/user-actions/user-actions.module';
import { HealthModule } from './health/health.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger.config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    WinstonModule.forRoot(winstonConfig),
    // FlowerModule,
    AuthModule,
    UserModule,
    PlantsModule,
    SensorReadingsModule,
    AdviceModule,
    UserActionsModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService,// Global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}