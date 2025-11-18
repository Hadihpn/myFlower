import { Module } from '@nestjs/common';
import { UserActionsService } from './user-actions.service';
import { UserActionsController } from './user-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActionEntity } from './entities/user-action.entity';
import { PlantEntity } from '../plants/entities/plant.entity';
import { PlantsService } from '../plants/plants.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserActionEntity, PlantEntity]),
  ],
  controllers: [UserActionsController],
  providers: [UserActionsService, PlantsService],
})
export class UserActionsModule {}
