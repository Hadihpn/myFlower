import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  Min,
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

export class CreatePlantPackageDto {
  @ApiProperty({ example: 'Mediterranean Herb Garden' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Perfect trio of herbs that thrive together',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Herbs', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Easy', required: false })
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  plantCount: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ThresholdsDto)
  thresholds: ThresholdsDto;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  plantSpeciesIds: number[];

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 'https://example.com/package.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  popular?: boolean;
}