import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorReadingDto {
  @ApiProperty({ example: 'DEVICE_001' })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 24.5 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ example: 65.3 })
  @IsNumber()
  moisture: number;

  @ApiProperty({ example: 28000 })
  @IsNumber()
  light: number;

  @ApiProperty({ example: 55.0, required: false })
  @IsOptional()
  @IsNumber()
  humidity?: number;

  @ApiProperty({ example: '2024-11-25T10:00:00Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ example: '1_abc123xyz789_1700000000000', description: 'Device authentication token' })
  @IsString()
  token: string;
}