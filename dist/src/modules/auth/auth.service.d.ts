import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './types/payload';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UserService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    checkEmail(email: string): Promise<void>;
    makeTokensForLogin(payload: PayloadType): {
        accessToken: string;
        refreshToken: string;
    };
    validateAccessToken(token: string): Promise<UserEntity>;
}
