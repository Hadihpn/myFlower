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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const otp_dto_1 = require("./dto/otp.dto");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const form_type_enum_1 = require("../../common/enums/form-type.enum");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    login(registerDto) {
        return this.authService.register(registerDto);
    }
    forgetPassword(otpDto) {
    }
    checkOtp(otpDto) {
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/register'),
    (0, swagger_1.ApiConsumes)(form_type_enum_1.FormType.UrlEncoded, form_type_enum_1.FormType.JSON),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiConsumes)(form_type_enum_1.FormType.UrlEncoded, form_type_enum_1.FormType.JSON),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/forget-password'),
    (0, swagger_1.ApiConsumes)(form_type_enum_1.FormType.UrlEncoded, form_type_enum_1.FormType.JSON),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.CheckOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('/check-otp'),
    (0, swagger_1.ApiConsumes)(form_type_enum_1.FormType.UrlEncoded, form_type_enum_1.FormType.JSON),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.CheckOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map