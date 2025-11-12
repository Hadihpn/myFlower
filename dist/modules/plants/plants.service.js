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
exports.PlantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plant_entity_1 = require("./entities/plant.entity");
let PlantsService = class PlantsService {
    plantsRepository;
    constructor(plantsRepository) {
        this.plantsRepository = plantsRepository;
    }
    async create(userId, createPlantDto) {
        const { name, description, location, plantedDate, status, deviceId } = createPlantDto;
        const existingPlant = await this.plantsRepository.findOne({
            where: { deviceId: createPlantDto.deviceId },
        });
        if (existingPlant) {
            throw new common_1.ConflictException('Device ID already registered');
        }
        const plant = this.plantsRepository.create({
            name,
            description,
            location,
            plantedDate,
            status,
            deviceId,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
        });
        return await this.plantsRepository.save(plant);
    }
    async findAll(userId) {
        return await this.plantsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const plant = await this.plantsRepository.findOne({
            where: { id, userId },
            relations: ['sensorReadings'],
        });
        if (!plant) {
            throw new common_1.NotFoundException('Plant not found');
        }
        return plant;
    }
    async findByDeviceId(deviceId) {
        return await this.plantsRepository.findOne({
            where: { deviceId },
        });
    }
    async update(id, userId, updatePlantDto) {
        const plant = await this.findOne(id, userId);
        if (updatePlantDto.deviceId && updatePlantDto.deviceId !== plant.deviceId) {
            const existingPlant = await this.plantsRepository.findOne({
                where: { deviceId: updatePlantDto.deviceId },
            });
            if (existingPlant) {
                throw new common_1.ConflictException('Device ID already registered');
            }
        }
        Object.assign(plant, updatePlantDto);
        return await this.plantsRepository.save(plant);
    }
    async remove(id, userId) {
        const plant = await this.findOne(id, userId);
        await this.plantsRepository.remove(plant);
    }
    async getPlantStatistics(plantId, userId) {
        const plant = await this.findOne(plantId, userId);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const readings = await this.plantsRepository
            .createQueryBuilder('plant')
            .leftJoinAndSelect('plant.sensorReadings', 'reading')
            .where('plant.id = :plantId', { plantId })
            .andWhere('reading.timestamp >= :date', { date: sevenDaysAgo })
            .orderBy('reading.timestamp', 'DESC')
            .getOne();
        if (!readings || !readings.sensorReadings.length) {
            return {
                plant: {
                    id: plant.id,
                    name: plant.name,
                    species: plant.species,
                },
                statistics: null,
                message: 'No sensor data available',
            };
        }
        const sensorReadings = readings.sensorReadings;
        const temperatures = sensorReadings.map((r) => Number(r.temperature));
        const moistures = sensorReadings.map((r) => Number(r.moisture));
        const lights = sensorReadings.map((r) => Number(r.light));
        const statistics = {
            temperature: {
                current: temperatures[0],
                average: this.calculateAverage(temperatures),
                min: Math.min(...temperatures),
                max: Math.max(...temperatures),
            },
            moisture: {
                current: moistures[0],
                average: this.calculateAverage(moistures),
                min: Math.min(...moistures),
                max: Math.max(...moistures),
            },
            light: {
                current: lights[0],
                average: this.calculateAverage(lights),
                min: Math.min(...lights),
                max: Math.max(...lights),
            },
            readingsCount: sensorReadings.length,
            lastReading: sensorReadings[0].timestamp,
        };
        return {
            plant: {
                id: plant.id,
                name: plant.name,
                species: plant.species,
            },
            statistics,
        };
    }
    calculateAverage(numbers) {
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / numbers.length) * 100) / 100;
    }
};
exports.PlantsService = PlantsService;
exports.PlantsService = PlantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plant_entity_1.PlantEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlantsService);
//# sourceMappingURL=plants.service.js.map