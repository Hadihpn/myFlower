import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'YourEmail@example.com' })
  @IsEmail(
    {},
    { message: 'فرمت ایمیل وارد شده صحیح نمیباشد.مطابق نمونه وارد نمایید' },
  )
  email: string;
}

export class CheckOtpDto {
  @ApiProperty({ example: 'YourEmail@example.com' })
  @IsEmail(
    {},
    { message: 'فرمت ایمیل وارد شده صحیح نمیباشد.مطابق نمونه وارد نمایید' },
  )
  email: string;
  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: 'کد وارد شده صحیح نمیباشد.' })
  code: string;
}
