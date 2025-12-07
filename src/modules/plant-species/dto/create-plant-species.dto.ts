import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ThresholdRangeDto {
  @ApiProperty({ example: 15 })
  @IsNumber()
  min: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  max: number;

  @ApiProperty({ example: { min: 18, max: 25 } })
  @ValidateNested()
  ideal: { min: number; max: number };
}

class ThresholdsDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ThresholdRangeDto)
  temperature: ThresholdRangeDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThresholdRangeDto)
  moisture: ThresholdRangeDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThresholdRangeDto)
  light: ThresholdRangeDto;
}

export class CreatePlantSpeciesDto {
  @ApiProperty({ example: 'Basil' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiProperty({ example: 'Ocimum basilicum', required: false })
  @IsOptional()
  @IsString()
  scientificName?: string;

  @ApiProperty({ example: ['Sweet Basil', 'Thai Basil'], required: false })
  @IsOptional()
  @IsArray()
  commonNames?: string[];

  @ApiProperty({ example: 'Herb' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Easy', required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThresholdsDto)
  thresholds: ThresholdsDto;

  @ApiProperty({ required: false })
  @IsOptional()
  watering?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  fertilization?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  growthInfo?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  harvestInfo?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  commonProblems?: Record<string, any>[];

  @ApiProperty({ example: ['Tomato', 'Carrot'], required: false })
  @IsOptional()
  @IsArray()
  companionPlants?: string[];

  @ApiProperty({ example: ['Fennel'], required: false })
  @IsOptional()
  @IsArray()
  avoidPlants?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  toxicity?: Record<string, any>;

  @ApiProperty({ example: ['Pinch tips for bushier growth'], required: false })
  @IsOptional()
  @IsArray()
  tips?: string[];

  @ApiProperty({ example: 'https://example.com/basil.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}