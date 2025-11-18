import { Module } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from '../plants/plants.service';
import { PlantEntity } from '../plants/entities/plant.entity';
import { AuthModule } from '../auth/auth.module';
import { UserActionsService } from '../user-actions/user-actions.service';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { UserActionEntity } from '../user-actions/entities/user-action.entity';
import { SensorReadingEntity } from '../sensor-readings/entities/sensor-reading.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PlantEntity,
      SensorReadingEntity,
      UserActionEntity,
    ]),
  ],
  controllers: [AdviceController],
  providers: [
    AdviceService,
    PlantsService,
    UserActionsService,
    SensorReadingsService,
  ],
})
export class AdviceModule {}
