import { PartialType } from '@nestjs/swagger';
import { CreateUserSubscriptionDto } from './create-user-subscription.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSubscriptionDto extends PartialType(
  CreateUserSubscriptionDto,
) {
  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}