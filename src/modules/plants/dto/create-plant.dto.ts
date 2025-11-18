import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantDto {
  @ApiProperty({ example: 'سانسوریا' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'مهتابی' })
  @IsString()
  species: string;

  @ApiProperty({ example: 'توضیحات', required: false })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ example: 'active' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'محل نگهداری', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'تاریخ کاشت' })
  @IsDateString()
  plantedDate: string;

  @ApiProperty()
  @IsString()
  deviceId: string;
}
