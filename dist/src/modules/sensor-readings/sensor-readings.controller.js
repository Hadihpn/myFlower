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
exports.SensorReadingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sensor_readings_service_1 = require("./sensor-readings.service");
const create_sensor_reading_dto_1 = require("./dto/create-sensor-reading.dto");
const auth_decorator_1 = require("../../common/decorators/auth.decorator");
let SensorReadingsController = class SensorReadingsController {
    sensorReadingsService;
    constructor(sensorReadingsService) {
        this.sensorReadingsService = sensorReadingsService;
    }
    async create(createSensorReadingDto) {
        return await this.sensorReadingsService.create(createSensorReadingDto);
    }
    async findByPlant(req, plantId, limit) {
        return await this.sensorReadingsService.findByPlant(plantId, req.user.id, limit);
    }
    async getLatest(req, plantId) {
        return await this.sensorReadingsService.getLatestReading(plantId, req.user.id);
    }
    async getDailyAggregates(req, plantId, days) {
        return await this.sensorReadingsService.getDailyAggregates(plantId, req.user.id, days);
    }
};
exports.SensorReadingsController = SensorReadingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create sensor reading (from IoT device - no auth required)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sensor_reading_dto_1.CreateSensorReadingDto]),
    __metadata("design:returntype", Promise)
], SensorReadingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('plant/:plantId'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get sensor readings for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SensorReadingsController.prototype, "findByPlant", null);
__decorate([
    (0, common_1.Get)('plant/:plantId/latest'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest sensor reading for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SensorReadingsController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('plant/:plantId/daily'),
    (0, auth_decorator_1.UserAuth)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily aggregates for a plant' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('plantId')),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SensorReadingsController.prototype, "getDailyAggregates", null);
exports.SensorReadingsController = SensorReadingsController = __decorate([
    (0, swagger_1.ApiTags)('Sensor Readings'),
    (0, common_1.Controller)('sensor-readings'),
    __metadata("design:paramtypes", [sensor_readings_service_1.SensorReadingsService])
], SensorReadingsController);
//# sourceMappingURL=sensor-readings.controller.js.map