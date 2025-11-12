import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PlantEntity])],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
