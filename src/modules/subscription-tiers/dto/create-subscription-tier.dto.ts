import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionTierDto {
  @ApiProperty({ example: 'Bronze' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  plantSlotLimit: number;

  @ApiProperty({ example: 5.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'monthly', required: false })
  @IsOptional()
  @IsString()
  billingCycle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  features?: Record<string, any>;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}