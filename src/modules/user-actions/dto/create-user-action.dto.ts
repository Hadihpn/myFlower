import { IsEnum, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../enum/user-actions.enum';

export class CreateUserActionDto {
  @ApiProperty({ enum: ActionType, example: ActionType.WATERED })
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty({ example: 'Watered thoroughly, soil was dry', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-11-11T09:00:00Z' })
  @IsDateString()
  actionDate: string;
}
