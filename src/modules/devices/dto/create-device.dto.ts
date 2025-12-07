import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ example: 'DEVICE_001' })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 'Backyard Sensor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Backyard Garden', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  calibration?: {
    temperatureOffset?: number;
    moistureOffset?: number;
    lightOffset?: number;
  };
}