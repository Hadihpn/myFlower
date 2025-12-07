import { IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../type/actionType.enum';


export class QueryUserActionsDto {
  @ApiProperty({ enum: ActionType, required: false })
  @IsOptional()
  @IsEnum(ActionType)
  actionType?: ActionType;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  days?: number;
}