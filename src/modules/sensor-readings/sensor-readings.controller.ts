import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { UpdateSensorReadingDto } from './dto/update-sensor-reading.dto';

@Controller('sensor-readings')
export class SensorReadingsController {
  constructor(private readonly sensorReadingsService: SensorReadingsService) {}

  @Post()
  create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return this.sensorReadingsService.create(createSensorReadingDto);
  }

  @Get()
  findAll() {
    return this.sensorReadingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorReadingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSensorReadingDto: UpdateSensorReadingDto) {
    return this.sensorReadingsService.update(+id, updateSensorReadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorReadingsService.remove(+id);
  }
}
