"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    jwtService;
    userService;
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async register(registerDto) {
        let { email, password } = registerDto;
        if (email.toString().trim() == '')
            throw new common_1.NotFoundException('لطفا ایمیل صحیح را وارد نمایید');
        if (password.toString().trim() == '')
            throw new common_1.NotFoundException('لطفا پسورد صحیح را وارد نمایید');
        password = await bcrypt.hashSync(registerDto.password, 10);
        let user = await this.userService.findByEmail(email);
        if (!user) {
            user = await this.userService.create({
                email,
                password,
            });
        }
        else {
            throw new common_1.ConflictException('این ایمیل قبلا ثبت شده است');
        }
        return {
            message: 'ثبت نام با موفقیت انجام شد',
        };
    }
    async login(loginDto) {
        let { email, password } = loginDto;
        const now = new Date();
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('اطلاعات وارد شده صحیح نمیباشد.');
        if (password.toString().trim() !== "")
            throw new common_1.UnauthorizedException('پسورد را وارد نمایید');
        if (!user.password) {
            password = await bcrypt.hashSync(password, 10);
            if (!bcrypt.compareSync(password, user.password))
                throw new common_1.UnauthorizedException('نام کاربری و رمز وارد شده مطابقت ندارد');
        }
        const { accessToken, refreshToken } = this.makeTokensForLogin({
            id: user.id,
        });
        return {
            accessToken,
            refreshToken,
            message: 'شما با موفقیت وارد شدید',
        };
    }
    async checkEmail(email) {
        const user = await this.userService.findByEmail(email);
        if (user)
            throw new common_1.ConflictException('email is already exist');
    }
    makeTokensForLogin(payload) {
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
    async validateAccessToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
            if (typeof payload === 'object' && payload?.id) {
                const user = await this.userService.findById(payload.id);
                if (!user) {
                    throw new common_1.UnauthorizedException('login on your account ');
                }
                return user;
            }
            throw new common_1.UnauthorizedException('login on your account ');
        }
        catch (error) {
            throw new common_1.UnauthorizedException('login on your account ');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map