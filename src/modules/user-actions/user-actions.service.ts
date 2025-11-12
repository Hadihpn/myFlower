import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { PlantsService } from '../plants/plants.service';
import { UserActionEntity } from './entities/user-action.entity';

@Injectable()
export class UserActionsService {
  constructor(
    @InjectRepository(UserActionEntity)
    private userActionsRepository: Repository<UserActionEntity>,
    private plantsService: PlantsService,
  ) {}

  async create(
    plantId: string,
    userId: string,
    createUserActionDto: CreateUserActionDto,
  ): Promise<UserActionEntity> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    const userAction = this.userActionsRepository.create({
      ...createUserActionDto,
      actionDate: new Date(createUserActionDto.actionDate),
      plantId,
      userId,
    });

    return await this.userActionsRepository.save(userAction);
  }

  async getRecentActions(
    plantId: string,
    userId: string,
    days: number = 30,
  ): Promise<UserActionEntity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.userActionsRepository.find({
      where: {
        plantId,
        userId,
        actionDate: MoreThan(startDate),
      },
      order: { actionDate: 'DESC' },
    });
  }

  async getAllActionsForPlant(
    plantId: string,
    userId: string,
  ): Promise<UserActionEntity[]> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    return await this.userActionsRepository.find({
      where: { plantId, userId },
      order: { actionDate: 'DESC' },
    });
  }

  async getActionsByType(
    plantId: string,
    userId: string,
    actionType: string,
  ): Promise<UserActionEntity[]> {
    // Verify user owns the plant
    await this.plantsService.findOne(plantId, userId);

    return await this.userActionsRepository.find({
      where: { plantId, userId, actionType: actionType as any },
      order: { actionDate: 'DESC' },
    });
  }
}