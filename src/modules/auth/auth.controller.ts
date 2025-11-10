import { Body, Controller, Post } from '@nestjs/common';
import {
  CheckOtpDto,
  SendOtpDto,
  SendSupplierOtpDto,
} from './dto/otp.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { FormType } from 'src/common/enums/form-type.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.(otpDto);
  }
  @Post('/check-otp')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  checkOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkOtp(otpDto);
  }
  @Post('/send-supplier-otp')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  sendSupplierOtp(@Body() otpDto: SendSupplierOtpDto) {
    return this.authService.sendSupplierOtp(otpDto);
  }
  @Post('/check-supplier-otp')
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  checkSupplierOtp(@Body() otpDto: CheckOtpDto) {
    return this.authService.checkSupplierOtp(otpDto);
  }
}
