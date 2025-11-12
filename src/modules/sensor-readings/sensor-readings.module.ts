import { Module } from '@nestjs/common';
import { SensorReadingsService } from './sensor-readings.service';
import { SensorReadingsController } from './sensor-readings.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorReadingEntity } from './entities/sensor-reading.entity';
import { PlantsService } from '../plants/plants.service';
import { PlantEntity } from '../plants/entities/plant.entity';

@Module({
  imports:[AuthModule,TypeOrmModule.forFeature([SensorReadingEntity,PlantEntity])],
  controllers: [SensorReadingsController],
  providers: [SensorReadingsService,PlantsService],
})
export class SensorReadingsModule {}
