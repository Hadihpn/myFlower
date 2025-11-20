import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowerModule } from './modules/flower/flower.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    FlowerModule,
    AuthModule,
    UserModule,
    PlantsModule,
    SensorReadingsModule,
    AdviceModule,
    UserActionsModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
