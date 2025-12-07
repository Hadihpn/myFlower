import { PartialType } from '@nestjs/swagger';
import { CreateUserPlantSelectionDto } from './create-user-plant-selection.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPlantSelectionDto extends PartialType(
  CreateUserPlantSelectionDto,
) {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}