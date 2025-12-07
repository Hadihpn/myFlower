import { IsEnum, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../type/actionType.enum';

export class CreateUserActionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  selectionId: number;

  @ApiProperty({ enum: ActionType, example: ActionType.WATERED })
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty({ example: 'Watered thoroughly, soil was dry', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-11-25T09:00:00Z' })
  @IsDateString()
  actionDate: string;
}