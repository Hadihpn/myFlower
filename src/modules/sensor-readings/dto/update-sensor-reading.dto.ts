import { PartialType } from '@nestjs/swagger';
import { CreateSensorReadingDto } from './create-sensor-reading.dto';

export class UpdateSensorReadingDto extends PartialType(
  CreateSensorReadingDto,
) {}
