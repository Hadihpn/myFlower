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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const core_1 = require("@nestjs/core");
const skip_auth_decorator_1 = require("../../../common/decorators/skip-auth.decorator");
const auth_service_1 = require("../auth.service");
let AuthGuard = class AuthGuard {
    authService;
    reflector;
    constructor(authService, reflector) {
        this.authService = authService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isSkippedAuth = this.reflector.get(skip_auth_decorator_1.SKIP_AUTH, context.getHandler());
        if (isSkippedAuth)
            return true;
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const token = this.extractToken(request);
        request.user = await this.authService.validateAccessToken(token);
        return true;
    }
    extractToken(request) {
        const { authorization } = request.headers;
        if (!authorization || authorization?.trim() == "") {
            throw new common_1.UnauthorizedException("Login on your account");
        }
        const [bearer, token] = authorization?.split(" ");
        if (bearer?.toLowerCase() !== "bearer" || !token || !(0, class_validator_1.isJWT)(token))
            throw new common_1.UnauthorizedException("Login on your account");
        return token;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map