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
exports.AdviceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const advice_service_1 = require("./advice.service");
const auth_decorator_1 = require("../../common/decorators/auth.decorator");
let AdviceController = class AdviceController {
    adviceService;
    constructor(adviceService) {
        this.adviceService = adviceService;
    }
    async getAdvice(req, plantId) {
        return await this.adviceService.getAdviceForPlant(plantId, req.user.id);
    }
};
exports.AdviceController = AdviceController;
__decorate([
    (0, common_1.Get)('plant/:plantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get care advice for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdviceController.prototype, "getAdvice", null);
exports.AdviceController = AdviceController = __decorate([
    (0, swagger_1.ApiTags)('Advice'),
    (0, common_1.Controller)('advice'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [advice_service_1.AdviceService])
], AdviceController);
//# sourceMappingURL=advice.controller.js.map