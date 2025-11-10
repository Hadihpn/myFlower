import { Body, Controller, Post } from '@nestjs/common';
import {
  CheckOtpDto,
  SendOtpDto,
} from './dto/otp.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { FormType } from 'src/common/enums/form-type.enum';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('/login')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  login(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('/forget-password')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  forgetPassword(@Body() otpDto: CheckOtpDto) {
    // return this.authService.checkOtp(otpDto);
  }
 @Post('/check-otp')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    // return this.authService.checkOtp(otpDto);
  }

}
