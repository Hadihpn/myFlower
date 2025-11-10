import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'YourEmail@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: '09123456789', required: false })
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: 'فرمت وارد شده اشتباه است.مطابق نمونه وارد نمایید' },
  )
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
