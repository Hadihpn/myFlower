import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from './dto/create-user-action.dto';
import { UserAuth } from 'src/common/decorators/auth.decorator';

@ApiTags('User Actions')
@Controller('user-actions')
@UserAuth()
@ApiBearerAuth()
export class UserActionsController {
  constructor(private userActionsService: UserActionsService) {}

  @Post('plant/:plantId')
  @ApiOperation({ summary: 'Record a care action for a plant' })
  async create(
    @Request() req,
    @Param('plantId') plantId: string,
    @Body() createUserActionDto: CreateUserActionDto,
  ) {
    return await this.userActionsService.create(
      plantId,
      req.user.id,
      createUserActionDto,
    );
  }

  @Get('plant/:plantId')
  @ApiOperation({ summary: 'Get all actions for a plant' })
  async getAllActions(@Request() req, @Param('plantId') plantId: string) {
    return await this.userActionsService.getAllActionsForPlant(
      plantId,
      req.user.id,
    );
  }

  @Get('plant/:plantId/recent')
  @ApiOperation({ summary: 'Get recent actions for a plant' })
  async getRecentActions(
    @Request() req,
    @Param('plantId') plantId: string,
    @Query('days') days?: number,
  ) {
    return await this.userActionsService.getRecentActions(
      plantId,
      req.user.id,
      days,
    );
  }

  @Get('plant/:plantId/type/:actionType')
  @ApiOperation({ summary: 'Get actions by type for a plant' })
  async getActionsByType(
    @Request() req,
    @Param('plantId') plantId: string,
    @Param('actionType') actionType: string,
  ) {
    return await this.userActionsService.getActionsByType(
      plantId,
      req.user.id,
      actionType,
    );
  }
}