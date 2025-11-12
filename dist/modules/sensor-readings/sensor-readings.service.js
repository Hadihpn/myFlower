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
exports.SensorReadingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plants_service_1 = require("../plants/plants.service");
const sensor_reading_entity_1 = require("./entities/sensor-reading.entity");
let SensorReadingsService = class SensorReadingsService {
    sensorReadingsRepository;
    plantsService;
    constructor(sensorReadingsRepository, plantsService) {
        this.sensorReadingsRepository = sensorReadingsRepository;
        this.plantsService = plantsService;
    }
    async create(createSensorReadingDto) {
        const plant = await this.plantsService.findByDeviceId(createSensorReadingDto.deviceId);
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with device ID ${createSensorReadingDto.deviceId} not found`);
        }
        const sensorReading = this.sensorReadingsRepository.create({
            temperature: createSensorReadingDto.temperature,
            moisture: createSensorReadingDto.moisture,
            light: createSensorReadingDto.light,
            timestamp: new Date(createSensorReadingDto.timestamp),
            plantId: plant.id,
        });
        return await this.sensorReadingsRepository.save(sensorReading);
    }
    async findByPlant(plantId, userId, limit = 100) {
        await this.plantsService.findOne(plantId, userId);
        return await this.sensorReadingsRepository.find({
            where: { plantId },
            order: { timestamp: 'DESC' },
            take: limit,
        });
    }
    async findByDateRange(plantId, userId, startDate, endDate) {
        await this.plantsService.findOne(plantId, userId);
        return await this.sensorReadingsRepository.find({
            where: {
                plantId,
                timestamp: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { timestamp: 'ASC' },
        });
    }
    async getDailyAggregates(plantId, userId, days = 7) {
        await this.plantsService.findOne(plantId, userId);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const readings = await this.sensorReadingsRepository
            .createQueryBuilder('reading')
            .select('DATE(reading.timestamp)', 'date')
            .addSelect('AVG(reading.temperature)', 'avgTemperature')
            .addSelect('AVG(reading.moisture)', 'avgMoisture')
            .addSelect('AVG(reading.light)', 'avgLight')
            .addSelect('MIN(reading.temperature)', 'minTemperature')
            .addSelect('MAX(reading.temperature)', 'maxTemperature')
            .addSelect('MIN(reading.moisture)', 'minMoisture')
            .addSelect('MAX(reading.moisture)', 'maxMoisture')
            .addSelect('MIN(reading.light)', 'minLight')
            .addSelect('MAX(reading.light)', 'maxLight')
            .addSelect('COUNT(*)', 'readingsCount')
            .where('reading.plantId = :plantId', { plantId })
            .andWhere('reading.timestamp >= :startDate', { startDate })
            .groupBy('DATE(reading.timestamp)')
            .orderBy('date', 'DESC')
            .getRawMany();
        return readings.map((reading) => ({
            date: reading.date,
            temperature: {
                avg: parseFloat(reading.avgTemperature),
                min: parseFloat(reading.minTemperature),
                max: parseFloat(reading.maxTemperature),
            },
            moisture: {
                avg: parseFloat(reading.avgMoisture),
                min: parseFloat(reading.minMoisture),
                max: parseFloat(reading.maxMoisture),
            },
            light: {
                avg: parseFloat(reading.avgLight),
                min: parseFloat(reading.minLight),
                max: parseFloat(reading.maxLight),
            },
            readingsCount: parseInt(reading.readingsCount),
        }));
    }
    async getLatestReading(plantId, userId) {
        await this.plantsService.findOne(plantId, userId);
        const reading = await this.sensorReadingsRepository.findOne({
            where: { plantId },
            order: { timestamp: 'DESC' },
        });
        if (!reading) {
            throw new common_1.NotFoundException('No sensor readings found for this plant');
        }
        return reading;
    }
};
exports.SensorReadingsService = SensorReadingsService;
exports.SensorReadingsService = SensorReadingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sensor_reading_entity_1.SensorReadingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        plants_service_1.PlantsService])
], SensorReadingsService);
//# sourceMappingURL=sensor-readings.service.js.map