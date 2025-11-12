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
exports.UserActionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_actions_service_1 = require("./user-actions.service");
const create_user_action_dto_1 = require("./dto/create-user-action.dto");
const auth_decorator_1 = require("../../common/decorators/auth.decorator");
let UserActionsController = class UserActionsController {
    userActionsService;
    constructor(userActionsService) {
        this.userActionsService = userActionsService;
    }
    async create(req, plantId, createUserActionDto) {
        return await this.userActionsService.create(plantId, req.user.id, createUserActionDto);
    }
    async getAllActions(req, plantId) {
        return await this.userActionsService.getAllActionsForPlant(plantId, req.user.id);
    }
    async getRecentActions(req, plantId, days) {
        return await this.userActionsService.getRecentActions(plantId, req.user.id, days);
    }
    async getActionsByType(req, plantId, actionType) {
        return await this.userActionsService.getActionsByType(plantId, req.user.id, actionType);
    }
};
exports.UserActionsController = UserActionsController;
__decorate([
    (0, common_1.Post)('plant/:plantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a care action for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_user_action_dto_1.CreateUserActionDto]),
    __metadata("design:returntype", Promise)
], UserActionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('plant/:plantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all actions for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserActionsController.prototype, "getAllActions", null);
__decorate([
    (0, common_1.Get)('plant/:plantId/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent actions for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], UserActionsController.prototype, "getRecentActions", null);
__decorate([
    (0, common_1.Get)('plant/:plantId/type/:actionType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get actions by type for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __param(2, (0, common_1.Param)('actionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserActionsController.prototype, "getActionsByType", null);
exports.UserActionsController = UserActionsController = __decorate([
    (0, swagger_1.ApiTags)('User Actions'),
    (0, common_1.Controller)('user-actions'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_actions_service_1.UserActionsService])
], UserActionsController);
//# sourceMappingURL=user-actions.controller.js.map