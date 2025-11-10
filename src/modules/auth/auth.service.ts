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
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './types/payload';
import { OtpService } from '../user/otp.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private jwtService: JwtService,
    private userService: UserService,
    private otpService: OtpService,
  ) {}

  //#region User
  async register(registerDto: RegisterDto) {
    const { email,password } = registerDto;
    if(password.toString().trim()=="") throw new NotFoundException("لطفا پسورد صحح را وارد نمایید")
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({
        email,
      
        if(password.toString()) 
        otp_expires_in: expiresIn,
      });
      otp = code;
    } else {
      otp = await this.updateOtpForUser(user);
    }

    return {
      otp,
      message: 'sent code successfully',
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const user = await this.userService.findOneByMobile({ mobile });
    if (!user || !user?.otp)
      throw new UnauthorizedException('Not Found Account');
    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('Otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException('Otp Code is expired');
    if (!user.mobile_verify) {
      user.mobile_verify = true;
      await this.userService.update(user.id, user);
    }
    const { accessToken, refreshToken } = this.makeTokensForLogin({
      id: user.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'You logged-in successfully',
    };
  }

  //#endregion
  //#region Supplier

  async sendSupplierOtp(sendSupplierOtp: SendSupplierOtpDto) {
    const {
      mobile,
      categoryId,
      city,
      manager_name,
      manager_family,
      store_name,
      invite_code,
    } = sendSupplierOtp;
    let otp;
    // let user = await this.userRepository.findOneBy({mobile});
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let supplier = await this.supplierService.findOneByMobile(mobile);
    if (!supplier) {
      supplier = await this.supplierService.create({
        mobile,
        otp_code: code,
        otp_expires_in: expiresIn,
        categoryId,
        city,
        invite_code,
        manager_family,
        manager_name,
        store_name,
      });
      otp = code;
    } else {
      otp = await this.updateOtpForSupplier(supplier);
    }

    return {
      otp,
      message: 'sent code successfully',
    };
  }
  async updateOtpForSupplier(supplier: SupplierEntity) {
    try {
      const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
      const code = randomInt(10000, 99999).toString();
      let { otp } = supplier;
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expiresIn;
      await this.supplierOtpService.update(otp.id, otp);
      return code;
    } catch (error) {
      console.log(error);
    }
  }
  async checkSupplierOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const supplier = await this.supplierService.findOneByMobile(mobile);
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException('Not Found Account');
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException('Otp code is incorrect');
    if (otp.expires_in < now)
      throw new UnauthorizedException('Otp Code is expired');
    if (!supplier.mobile_verify) {
      supplier.mobile_verify = true;
      await this.userService.update(supplier.id, supplier);
    }
    const { accessToken, refreshToken } = this.makeTokensForLogin({
      id: supplier.id,
    });
    return {
      accessToken,
      refreshToken,
      message: 'You logged-in successfully',
    };
  }
  //#endregion
  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException('email is already exist');
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (user) throw new ConflictException('mobile number is already exist');
  }
  async updateOtpForUser(user: UserEntity) {
    try {
      const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
      const code = randomInt(10000, 99999).toString();
      let { otp } = user;
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expiresIn;
      await this.otpService.update(otp.id, otp);
      return code;
    } catch (error) {
      console.log(error);
    }
  }

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
        const user = await this.userRepository.findOneBy({ id: payload.id });
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
