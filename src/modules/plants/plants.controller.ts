import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { UserAuth } from 'src/common/decorators/auth.decorator';

@ApiTags('Plants')
@Controller('plants')
@UserAuth()
@ApiBearerAuth()
export class PlantsController {
  constructor(private plantsService: PlantsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new plant' })
  async create(@Request() req, @Body() createPlantDto: CreatePlantDto) {
    return await this.plantsService.create(req.user.id, createPlantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user plants' })
  async findAll(@Request() req) {
    return await this.plantsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plant by ID' })
  async findOne(@Request() req, @Param('id') id: number) {
    return await this.plantsService.findOne(id, req.user.id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get plant statistics' })
  async getStatistics(@Request() req, @Param('id') id: number) {
    return await this.plantsService.getPlantStatistics(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update plant' })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updatePlantDto: UpdatePlantDto,
  ) {
    return await this.plantsService.update(id, req.user.id, updatePlantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plant' })
  async remove(@Request() req, @Param('id') id: number) {
    await this.plantsService.remove(id, req.user.id);
    return { message: 'Plant deleted successfully' };
  }
}