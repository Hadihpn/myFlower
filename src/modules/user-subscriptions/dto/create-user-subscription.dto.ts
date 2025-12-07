import { IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSubscriptionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  tierId: number;

  @ApiProperty({ example: '2024-11-25T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-11-25T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}