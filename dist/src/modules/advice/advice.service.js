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
        const recentReadings = await this.sensorReadingsService.findByPlant(plantId, userId, 50);
        const suddenChangeAdvice = await this.detectSuddenChanges(recentReadings, thresholds);
        advice.push(...suddenChangeAdvice);
        const currentAdvice = this.analyzeCurrentConditions(statistics.statistics, thresholds);
        advice.push(...currentAdvice);
        const careAdvice = await this.analyzeCareHistory(plantId, userId, plant);
        advice.push(...careAdvice);
        const trendAdvice = this.analyzeTrends(statistics.statistics);
        advice.push(...trendAdvice);
        const criticals = advice.filter((a) => a.type === 'critical').length;
        const warnings = advice.filter((a) => a.type === 'warning').length;
        const successes = advice.filter((a) => a.type === 'success').length;
        let overallHealth;
        if (criticals > 0) {
            overallHealth = 'critical';
        }
        else if (warnings >= 2) {
            overallHealth = 'needs attention';
        }
        else if (warnings === 1) {
            overallHealth = 'fair';
        }
        else if (successes >= 2) {
            overallHealth = 'excellent';
        }
        else {
            overallHealth = 'good';
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
    async detectSuddenChanges(readings, thresholds) {
        const advice = [];
        if (readings.length < 3)
            return advice;
        const latest = readings[0];
        const oneHourAgo = readings.find((r, idx) => idx >= 2);
        const twoHoursAgo = readings.find((r, idx) => idx >= 4);
        if (!oneHourAgo)
            return advice;
        const tempDrop = Number(oneHourAgo.temperature) - Number(latest.temperature);
        if (tempDrop >= 5) {
            advice.push({
                type: 'critical',
                category: 'temperature',
                message: `⚠️ ALERT: Temperature dropped ${tempDrop.toFixed(1)}°C in last hour! Risk of cold damage. Consider bringing plant indoors or adding frost protection.`,
                priority: 0,
                actionRequired: true,
            });
        }
        const tempSpike = Number(latest.temperature) - Number(oneHourAgo.temperature);
        if (tempSpike >= 5) {
            advice.push({
                type: 'critical',
                category: 'temperature',
                message: `⚠️ ALERT: Temperature rose ${tempSpike.toFixed(1)}°C in last hour! Risk of heat stress. Provide shade or move to cooler location immediately.`,
                priority: 0,
                actionRequired: true,
            });
        }
        if (twoHoursAgo) {
            const moistureDrop = Number(twoHoursAgo.moisture) - Number(latest.moisture);
            if (moistureDrop >= 20) {
                advice.push({
                    type: 'warning',
                    category: 'moisture',
                    message: `Soil moisture dropped ${moistureDrop.toFixed(1)}% in 2 hours. Check for drainage issues or leaks in irrigation system.`,
                    priority: 1,
                    actionRequired: true,
                });
            }
        }
        const lightDrop = Number(oneHourAgo.light) - Number(latest.light);
        if (lightDrop >= 10000 && Number(latest.light) < thresholds.light.min) {
            advice.push({
                type: 'info',
                category: 'light',
                message: `Light intensity dropped significantly (weather change detected). Consider supplemental grow lights if cloudy conditions persist.`,
                priority: 2,
            });
        }
        return advice;
    }
    analyzeCurrentConditions(statistics, thresholds) {
        const advice = [];
        const currentTemp = statistics.temperature.current;
        if (currentTemp < thresholds.temperature.min) {
            advice.push({
                type: 'warning',
                category: 'temperature',
                message: `Temperature is too low (${currentTemp}°C). Move to warmer location or add heat protection.`,
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
        const currentMoisture = statistics.moisture.current;
        if (currentMoisture < thresholds.moisture.min) {
            advice.push({
                type: 'critical',
                category: 'moisture',
                message: `Soil is too dry (${currentMoisture}%). Water your plant immediately!`,
                priority: 0,
                actionRequired: true,
            });
        }
        else if (currentMoisture > thresholds.moisture.max) {
            advice.push({
                type: 'warning',
                category: 'moisture',
                message: `Soil is too wet (${currentMoisture}%). Risk of root rot. Stop watering and ensure drainage.`,
                priority: 1,
                actionRequired: true,
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
        const currentLight = statistics.light.current;
        if (currentLight < thresholds.light.min) {
            advice.push({
                type: 'warning',
                category: 'light',
                message: `Light intensity is too low (${currentLight} lux). Move to brighter location or add grow lights.`,
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
        return advice;
    }
    async analyzeCareHistory(plantId, userId, plant) {
        const advice = [];
        const recentActions = await this.userActionsService.getRecentActions(plantId, userId, 30);
        const now = new Date();
        const plantAge = Math.floor((now.getTime() - new Date(plant.plantedDate).getTime()) /
            (1000 * 60 * 60 * 24));
        const lastWatered = recentActions.find((a) => a.actionType === 'watered');
        if (lastWatered) {
            const daysSinceWatered = Math.floor((now.getTime() - new Date(lastWatered.actionDate).getTime()) /
                (1000 * 60 * 60 * 24));
            if (daysSinceWatered >= 7) {
                advice.push({
                    type: 'info',
                    category: 'care',
                    message: `You last watered this plant ${daysSinceWatered} days ago. Check soil moisture regularly.`,
                    priority: 2,
                });
            }
        }
        const lastFertilized = recentActions.find((a) => a.actionType === 'fertilized');
        if (lastFertilized) {
            const daysSinceFertilized = Math.floor((now.getTime() - new Date(lastFertilized.actionDate).getTime()) /
                (1000 * 60 * 60 * 24));
            if (daysSinceFertilized >= 30) {
                advice.push({
                    type: 'info',
                    category: 'care',
                    message: `Last fertilized ${daysSinceFertilized} days ago. Consider fertilizing if plant is in active growth.`,
                    priority: 2,
                });
            }
        }
        else if (plantAge >= 30) {
            advice.push({
                type: 'info',
                category: 'care',
                message: `No fertilization recorded. Consider adding nutrients for healthy growth.`,
                priority: 2,
            });
        }
        const lastSoilChange = recentActions.find((a) => a.actionType === 'soil_changed');
        if (!lastSoilChange && plantAge >= 180) {
            advice.push({
                type: 'info',
                category: 'care',
                message: `Plant is ${Math.floor(plantAge / 30)} months old. Consider refreshing soil or repotting if growth has slowed.`,
                priority: 3,
            });
        }
        return advice;
    }
    analyzeTrends(statistics) {
        const advice = [];
        const moistureDiff = statistics.moisture.average - statistics.moisture.current;
        if (moistureDiff > 10) {
            advice.push({
                type: 'info',
                category: 'moisture',
                message: 'Moisture levels are below recent average. May need more frequent watering.',
                priority: 2,
            });
        }
        else if (moistureDiff < -10) {
            advice.push({
                type: 'info',
                category: 'moisture',
                message: 'Moisture levels are higher than usual. Monitor for overwatering.',
                priority: 2,
            });
        }
        return advice;
    }
    calculateAverage(numbers) {
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / numbers.length) * 100) / 100;
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