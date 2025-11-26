import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckOtpDto, SendOtpDto } from './dto/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './types/payload';
// import { OtpService } from '../user/otp.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    // private otpService: OtpService,
  ) {}

  //#region User
  async register(registerDto: RegisterDto) {
    let { email, password } = registerDto;
    //check for email and password
    if (email.toString().trim() == '')
      throw new NotFoundException('لطفا ایمیل صحیح را وارد نمایید');
    if (password.toString().trim() == '')
      throw new NotFoundException('لطفا پسورد صحیح را وارد نمایید');
    // Hash password
   let hashedPassword = await bcrypt.hash(registerDto.password, 10);
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({
        email,
        password:hashedPassword,
        fullName: registerDto.fullName,
        phone: registerDto.phone
      });
      
    } else {
      throw new ConflictException('این ایمیل قبلا ثبت شده است');
    }
    
// THIS should be returned:
  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
      // message: 'ثبت نام با موفقیت انجام شد',
    token:"",
  };
    // return {
    // };
  }

  async login(loginDto: LoginDto) {
    let { email, password } = loginDto;
     // ✅ Check if email is empty
  if (email.toString().trim() === '')
    throw new UnauthorizedException('لطفا ایمیل صحیح را وارد نمایید');
  // ✅ Check if password is empty (change !== to ===)
    if (password.toString().trim() === '')
    throw new UnauthorizedException('پسورد را وارد نمایید');

  const user = await this.userService.findByEmail(email);
  
  if (!user)
      throw new UnauthorizedException('اطلاعات وارد شده صحیح نمیباشد.');
      // ✅  Check if password is empty
    if (password.toString().trim() === '')
      throw new UnauthorizedException('پسورد را وارد نمایید');
     // ✅ Compare passwords correctly
     // ✅ Compare passwords correctly
       if (!user.password) {  // Changed logic - should be "if (user.password)"
    throw new UnauthorizedException('پسورد برای این کاربر تنظیم نشده است');
  }
      //compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid)
        throw new UnauthorizedException(
          'نام کاربری و رمز وارد شده مطابقت ندارد',
        );

    const { accessToken, refreshToken } = this.makeTokensForLogin({
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'شما با موفقیت وارد شدید',
    };
  }

  //#endregion

  async checkEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) throw new ConflictException('email is already exist');
  }
  // async checkMobile(mobile: string) {
  //   const user = await this.userRepository.findOneBy({ mobile });
  //   if (user) throw new ConflictException('mobile number is already exist');
  // }

  makeTokensForLogin(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && payload?.id) {
        const user = await this.userService.findById(payload.id);
        if (!user) {
          throw new UnauthorizedException('login on your account ');
        }
        return user;
      }
      throw new UnauthorizedException('login on your account ');
    } catch (error) {
      throw new UnauthorizedException('login on your account ');
    }
  }
}
