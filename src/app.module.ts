import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowerModule } from './modules/flower/flower.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { PlantsModule } from './modules/plants/plants.module';
import { UserModule } from './modules/users/user.module';
import { SensorReadingsModule } from './modules/sensor-readings/sensor-readings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
    }),
    FlowerModule,
    AuthModule,
    UserModule,
    PlantsModule,
    SensorReadingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
