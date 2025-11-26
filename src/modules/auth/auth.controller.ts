import { Body, Controller, Post } from '@nestjs/common';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { FormType } from 'src/common/enums/form-type.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
   @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('/login')
   @ApiOperation({ summary: 'Login user' })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
