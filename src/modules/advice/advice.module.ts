import { Module } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { AdviceController } from './advice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from '../plants/plants.service';
import { PlantEntity } from '../plants/entities/plant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([PlantEntity])],
  controllers: [AdviceController],
  providers: [AdviceService,PlantsService],
})
export class AdviceModule {}
