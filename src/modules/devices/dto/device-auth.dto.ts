import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeviceAuthDto {
  @ApiProperty({ example: '1_abc123xyz789_1700000000000' })
  @IsString()
  token: string;
}