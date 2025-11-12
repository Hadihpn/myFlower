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
exports.AdviceService = void 0;
const common_1 = require("@nestjs/common");
const plants_service_1 = require("../plants/plants.service");
const sensor_readings_service_1 = require("../sensor-readings/sensor-readings.service");
const user_actions_service_1 = require("../user-actions/user-actions.service");
let AdviceService = class AdviceService {
    sensorReadingsService;
    plantsService;
    userActionsService;
    plantThresholds = {
        default: {
            temperature: { min: 15, max: 30, ideal: { min: 18, max: 25 } },
            moisture: { min: 30, max: 80, ideal: { min: 40, max: 70 } },
            light: { min: 5000, max: 50000, ideal: { min: 10000, max: 30000 } },
        },
        Tomato: {
            temperature: { min: 18, max: 32, ideal: { min: 21, max: 27 } },
            moisture: { min: 40, max: 85, ideal: { min: 60, max: 80 } },
            light: { min: 15000, max: 60000, ideal: { min: 25000, max: 40000 } },
        },
        Rose: {
            temperature: { min: 15, max: 29, ideal: { min: 18, max: 24 } },
            moisture: { min: 35, max: 75, ideal: { min: 50, max: 65 } },
            light: { min: 20000, max: 50000, ideal: { min: 25000, max: 35000 } },
        },
        Basil: {
            temperature: { min: 20, max: 35, ideal: { min: 22, max: 28 } },
            moisture: { min: 45, max: 80, ideal: { min: 55, max: 70 } },
            light: { min: 15000, max: 45000, ideal: { min: 20000, max: 30000 } },
        },
    };
    constructor(sensorReadingsService, plantsService, userActionsService) {
        this.sensorReadingsService = sensorReadingsService;
        this.plantsService = plantsService;
        this.userActionsService = userActionsService;
    }
    async getAdviceForPlant(plantId, userId) {
        const plant = await this.plantsService.findOne(plantId, userId);
        const statistics = await this.plantsService.getPlantStatistics(plantId, userId);
        if (!statistics.statistics) {
            return {
                plant: statistics.plant,
                advice: [
                    {
                        type: 'info',
                        category: 'general',
                        message: 'No sensor data available yet. Waiting for first reading.',
                        priority: 2,
                    },
                ],
                overallHealth: 'unknown',
            };
        }
        const thresholds = this.plantThresholds[plant.species] || this.plantThresholds.default;
        const advice = [];
        const currentTemp = statistics.statistics.temperature.current;
        const avgTemp = statistics.statistics.temperature.average;
        if (currentTemp < thresholds.temperature.min) {
            advice.push({
                type: 'warning',
                category: 'temperature',
                message: `Temperature is too low (${currentTemp}°C). Consider moving plant to warmer location or providing heat protection.`,
                priority: 1,
            });
        }
        else if (currentTemp > thresholds.temperature.max) {
            advice.push({
                type: 'warning',
                category: 'temperature',
                message: `Temperature is too high (${currentTemp}°C). Provide shade or move to cooler location.`,
                priority: 1,
            });
        }
        else if (currentTemp >= thresholds.temperature.ideal.min &&
            currentTemp <= thresholds.temperature.ideal.max) {
            advice.push({
                type: 'success',
                category: 'temperature',
                message: `Temperature is ideal (${currentTemp}°C).`,
                priority: 3,
            });
        }
        else {
            advice.push({
                type: 'info',
                category: 'temperature',
                message: `Temperature is acceptable (${currentTemp}°C) but not optimal. Ideal range: ${thresholds.temperature.ideal.min}-${thresholds.temperature.ideal.max}°C.`,
                priority: 2,
            });
        }
        const currentMoisture = statistics.statistics.moisture.current;
        const avgMoisture = statistics.statistics.moisture.average;
        if (currentMoisture < thresholds.moisture.min) {
            advice.push({
                type: 'warning',
                category: 'moisture',
                message: `Soil is too dry (${currentMoisture}%). Water your plant immediately!`,
                priority: 1,
            });
        }
        else if (currentMoisture > thresholds.moisture.max) {
            advice.push({
                type: 'warning',
                category: 'moisture',
                message: `Soil is too wet (${currentMoisture}%). Risk of root rot. Stop watering and ensure proper drainage.`,
                priority: 1,
            });
        }
        else if (currentMoisture >= thresholds.moisture.ideal.min &&
            currentMoisture <= thresholds.moisture.ideal.max) {
            advice.push({
                type: 'success',
                category: 'moisture',
                message: `Soil moisture is perfect (${currentMoisture}%).`,
                priority: 3,
            });
        }
        else {
            advice.push({
                type: 'info',
                category: 'moisture',
                message: `Soil moisture is acceptable (${currentMoisture}%) but could be better. Ideal range: ${thresholds.moisture.ideal.min}-${thresholds.moisture.ideal.max}%.`,
                priority: 2,
            });
        }
        const currentLight = statistics.statistics.light.current;
        const avgLight = statistics.statistics.light.average;
        if (currentLight < thresholds.light.min) {
            advice.push({
                type: 'warning',
                category: 'light',
                message: `Light intensity is too low (${currentLight} lux). Move plant to brighter location or add grow lights.`,
                priority: 1,
            });
        }
        else if (currentLight > thresholds.light.max) {
            advice.push({
                type: 'warning',
                category: 'light',
                message: `Light intensity is too high (${currentLight} lux). Provide shade to prevent leaf burn.`,
                priority: 1,
            });
        }
        else if (currentLight >= thresholds.light.ideal.min &&
            currentLight <= thresholds.light.ideal.max) {
            advice.push({
                type: 'success',
                category: 'light',
                message: `Light intensity is excellent (${currentLight} lux).`,
                priority: 3,
            });
        }
        else {
            advice.push({
                type: 'info',
                category: 'light',
                message: `Light intensity is acceptable (${currentLight} lux). Ideal range: ${thresholds.light.ideal.min}-${thresholds.light.ideal.max} lux.`,
                priority: 2,
            });
        }
        if (avgMoisture < currentMoisture - 10) {
            advice.push({
                type: 'info',
                category: 'moisture',
                message: 'Moisture levels have increased recently. Monitor for overwatering.',
                priority: 2,
            });
        }
        else if (avgMoisture > currentMoisture + 10) {
            advice.push({
                type: 'info',
                category: 'moisture',
                message: 'Moisture levels are decreasing. May need more frequent watering.',
                priority: 2,
            });
        }
        const warnings = advice.filter((a) => a.type === 'warning').length;
        const successes = advice.filter((a) => a.type === 'success').length;
        let overallHealth;
        if (warnings === 0 && successes >= 2) {
            overallHealth = 'excellent';
        }
        else if (warnings === 0) {
            overallHealth = 'good';
        }
        else if (warnings <= 1) {
            overallHealth = 'fair';
        }
        else {
            overallHealth = 'needs attention';
        }
        advice.sort((a, b) => a.priority - b.priority);
        return {
            plant: {
                id: plant.id,
                name: plant.name,
                species: plant.species,
            },
            statistics: statistics.statistics,
            advice,
            overallHealth,
            thresholds,
        };
    }
};
exports.AdviceService = AdviceService;
exports.AdviceService = AdviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensor_readings_service_1.SensorReadingsService,
        plants_service_1.PlantsService,
        user_actions_service_1.UserActionsService])
], AdviceService);
//# sourceMappingURL=advice.service.js.map