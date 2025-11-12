import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { UserAuth } from 'src/common/decorators/auth.decorator';

@ApiTags('Sensor Readings')
@Controller('sensor-readings')
export class SensorReadingsController {
  constructor(private sensorReadingsService: SensorReadingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create sensor reading (from IoT device - no auth required)',
  })
  async create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return await this.sensorReadingsService.create(createSensorReadingDto);
  }

  @Get('plant/:plantId')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sensor readings for a plant' })
  async findByPlant(
    @Request() req,
    @Param('plantId') plantId: string,
    @Query('limit') limit?: number,
  ) {
    return await this.sensorReadingsService.findByPlant(
      plantId,
      req.user.id,
      limit,
    );
  }

  @Get('plant/:plantId/latest')
  @UserAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get latest sensor reading for a plant' })
  async getLatest(@Request() req, @Param('plantId') plantId: string) {
    return await this.sensorReadingsService.getLatestReading(
      plantId,
      req.user.id,
    );
  }

  @Get('plant/:plantId/daily')
    @UserAuth()

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get daily aggregates for a plant' })
  async getDailyAggregates(
    @Request() req,
    @Param('plantId') plantId: string,
    @Query('days') days?: number,
  ) {
    return await this.sensorReadingsService.getDailyAggregates(
      plantId,
      req.user.id,
      days,
    );
  }
}
