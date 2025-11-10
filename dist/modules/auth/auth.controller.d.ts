import { CheckOtpDto } from './dto/otp.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    forgetPassword(otpDto: CheckOtpDto): void;
    checkOtp(otpDto: CheckOtpDto): void;
}
