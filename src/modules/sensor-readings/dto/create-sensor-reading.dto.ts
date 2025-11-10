import { IsNumber, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorReadingDto {
  @ApiProperty({ example: 'DEVICE_001' })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 22.5 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ example: 65.3 })
  @IsNumber()
  moisture: number;

  @ApiProperty({ example: 15000.75 })
  @IsNumber()
  light: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  timestamp: string;
}