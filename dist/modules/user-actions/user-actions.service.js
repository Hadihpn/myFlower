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
exports.UserActionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plants_service_1 = require("../plants/plants.service");
const user_action_entity_1 = require("./entities/user-action.entity");
let UserActionsService = class UserActionsService {
    userActionsRepository;
    plantsService;
    constructor(userActionsRepository, plantsService) {
        this.userActionsRepository = userActionsRepository;
        this.plantsService = plantsService;
    }
    async create(plantId, userId, createUserActionDto) {
        await this.plantsService.findOne(plantId, userId);
        const userAction = this.userActionsRepository.create({
            ...createUserActionDto,
            actionDate: new Date(createUserActionDto.actionDate),
            plantId,
            userId,
        });
        return await this.userActionsRepository.save(userAction);
    }
    async getRecentActions(plantId, userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return await this.userActionsRepository.find({
            where: {
                plantId,
                userId,
                actionDate: (0, typeorm_2.MoreThan)(startDate),
            },
            order: { actionDate: 'DESC' },
        });
    }
    async getAllActionsForPlant(plantId, userId) {
        await this.plantsService.findOne(plantId, userId);
        return await this.userActionsRepository.find({
            where: { plantId, userId },
            order: { actionDate: 'DESC' },
        });
    }
    async getActionsByType(plantId, userId, actionType) {
        await this.plantsService.findOne(plantId, userId);
        return await this.userActionsRepository.find({
            where: { plantId, userId, actionType: actionType },
            order: { actionDate: 'DESC' },
        });
    }
};
exports.UserActionsService = UserActionsService;
exports.UserActionsService = UserActionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_action_entity_1.UserActionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        plants_service_1.PlantsService])
], UserActionsService);
//# sourceMappingURL=user-actions.service.js.map