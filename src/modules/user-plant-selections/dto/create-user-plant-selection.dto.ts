import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPlantSelectionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  deviceId: number;

  @ApiProperty({ example: 1, required: false, description: 'Select package OR individual plant' })
  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => !o.plantSpeciesId)
  packageId?: number;

  @ApiProperty({ example: 1, required: false, description: 'Select package OR individual plant' })
  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => !o.packageId)
  plantSpeciesId?: number;

  @ApiProperty({ example: 'My Herb Garden', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  plantedDate?: string;

  @ApiProperty({ example: 'Kitchen Window', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Needs afternoon shade', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}