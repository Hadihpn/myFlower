"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActionsService = void 0;
const common_1 = require("@nestjs/common");
let UserActionsService = class UserActionsService {
    create(createUserActionDto) {
        return 'This action adds a new userAction';
    }
    findAll() {
        return `This action returns all userActions`;
    }
    findOne(id) {
        return `This action returns a #${id} userAction`;
    }
    update(id, updateUserActionDto) {
        return `This action updates a #${id} userAction`;
    }
    remove(id) {
        return `This action removes a #${id} userAction`;
    }
};
exports.UserActionsService = UserActionsService;
exports.UserActionsService = UserActionsService = __decorate([
    (0, common_1.Injectable)()
], UserActionsService);
//# sourceMappingURL=user-actions.service.js.map