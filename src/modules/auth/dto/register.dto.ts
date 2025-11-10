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
  @IsEmail({}, {message: " ایمیل وارد شده صحیح نمیباشد.مطابق نمونه وارد نمایید"})
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsOptional()
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
  phone?: string;
}
