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
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttleConfig } from './config/throttle.config';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { BusinessLogicInterceptor } from './common/interceptors/business-logic.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    // Winston Logger
    WinstonModule.forRoot(winstonConfig),
    // Rate Limiting
    ThrottlerModule.forRoot(throttleConfig),
    // FlowerModule,
    AuthModule,
    UserModule,
    PlantsModule,
    SensorReadingsModule,
    AdviceModule,
    UserActionsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, // Global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
     // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    // Global HTTP logging (logs all requests/responses automatically)
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global business logic logging (logs important events automatically)
    {
      provide: APP_INTERCEPTOR,
      useClass: BusinessLogicInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
