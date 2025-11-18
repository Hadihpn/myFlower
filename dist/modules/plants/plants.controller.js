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
exports.PlantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plants_service_1 = require("./plants.service");
const create_plant_dto_1 = require("./dto/create-plant.dto");
const update_plant_dto_1 = require("./dto/update-plant.dto");
const auth_decorator_1 = require("../../common/decorators/auth.decorator");
let PlantsController = class PlantsController {
    plantsService;
    constructor(plantsService) {
        this.plantsService = plantsService;
    }
    async create(req, createPlantDto) {
        return await this.plantsService.create(req.user.id, createPlantDto);
    }
    async findAll(req) {
        return await this.plantsService.findAll(req.user.id);
    }
    async findOne(req, id) {
        return await this.plantsService.findOne(id, req.user.id);
    }
    async getStatistics(req, id) {
        return await this.plantsService.getPlantStatistics(id, req.user.id);
    }
    async update(req, id, updatePlantDto) {
        return await this.plantsService.update(id, req.user.id, updatePlantDto);
    }
    async remove(req, id) {
        await this.plantsService.remove(id, req.user.id);
        return { message: 'Plant deleted successfully' };
    }
};
exports.PlantsController = PlantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_plant_dto_1.CreatePlantDto]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user plants' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get plant by ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get plant statistics' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_plant_dto_1.UpdatePlantDto]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "remove", null);
exports.PlantsController = PlantsController = __decorate([
    (0, swagger_1.ApiTags)('Plants'),
    (0, common_1.Controller)('plants'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [plants_service_1.PlantsService])
], PlantsController);
//# sourceMappingURL=plants.controller.js.map