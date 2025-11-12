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
const user_actions_service_1 = require("./user-actions.service");
const create_user_action_dto_1 = require("./dto/create-user-action.dto");
const update_user_action_dto_1 = require("./dto/update-user-action.dto");
let UserActionsController = class UserActionsController {
    userActionsService;
    constructor(userActionsService) {
        this.userActionsService = userActionsService;
    }
    create(createUserActionDto) {
        return this.userActionsService.create(createUserActionDto);
    }
    findAll() {
        return this.userActionsService.findAll();
    }
    findOne(id) {
        return this.userActionsService.findOne(+id);
    }
    update(id, updateUserActionDto) {
        return this.userActionsService.update(+id, updateUserActionDto);
    }
    remove(id) {
        return this.userActionsService.remove(+id);
    }
};
exports.UserActionsController = UserActionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_action_dto_1.CreateUserActionDto]),
    __metadata("design:returntype", void 0)
], UserActionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserActionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserActionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_action_dto_1.UpdateUserActionDto]),
    __metadata("design:returntype", void 0)
], UserActionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserActionsController.prototype, "remove", null);
exports.UserActionsController = UserActionsController = __decorate([
    (0, common_1.Controller)('user-actions'),
    __metadata("design:paramtypes", [user_actions_service_1.UserActionsService])
], UserActionsController);
//# sourceMappingURL=user-actions.controller.js.map