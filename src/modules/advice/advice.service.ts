import { Injectable } from '@nestjs/common';
// import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { PlantsService } from '../plants/plants.service';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { UserActionsService } from '../user-actions/user-actions.service';

@Injectable()
export class AdviceService {
  private readonly plantThresholds = {
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

  constructor(
    private sensorReadingsService: SensorReadingsService,
    private plantsService: PlantsService,
    private userActionsService: UserActionsService,
  ) {}

  async getAdviceForPlant(plantId: number, userId: number) {
    const plant = await this.plantsService.findOne(plantId, userId);
    const statistics = await this.plantsService.getPlantStatistics(
      plantId,
      userId,
    );

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

    const thresholds =
      this.plantThresholds[plant.species] || this.plantThresholds.default;
    const advice: AdviceItem[] = [];

    // Get recent readings for sudden change detection
    const recentReadings = await this.sensorReadingsService.findByPlant(
      plantId,
      userId,
      50, // Last 50 readings (about 1 day if reading every 30min)
    );

    // Check for sudden changes
    const suddenChangeAdvice = await this.detectSuddenChanges(
      recentReadings,
      thresholds,
    );
    advice.push(...suddenChangeAdvice);

    // Current conditions advice
    const currentAdvice = this.analyzeCurrentConditions(
      statistics.statistics,
      thresholds,
    );
    advice.push(...currentAdvice);

    // User care history advice
    const careAdvice = await this.analyzeCareHistory(plantId, userId, plant);
    advice.push(...careAdvice);

    // Trend analysis
    const trendAdvice = this.analyzeTrends(statistics.statistics);
    advice.push(...trendAdvice);

    // Overall health assessment
    const criticals = advice.filter((a) => a.type === 'critical').length;
    const warnings = advice.filter((a) => a.type === 'warning').length;
    const successes = advice.filter((a) => a.type === 'success').length;

    let overallHealth: string;
    if (criticals > 0) {
      overallHealth = 'critical';
    } else if (warnings >= 2) {
      overallHealth = 'needs attention';
    } else if (warnings === 1) {
      overallHealth = 'fair';
    } else if (successes >= 2) {
      overallHealth = 'excellent';
    } else {
      overallHealth = 'good';
    }

    // Sort by priority
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

  // NEW: Detect sudden changes
  private async detectSuddenChanges(readings: any[], thresholds: any) {
    const advice: AdviceItem[] = [];

    if (readings.length < 3) return advice; // Need at least 3 readings

    const latest = readings[0];
    const oneHourAgo = readings.find((r, idx) => idx >= 2); // ~1 hour (2 readings at 30min intervals)
    const twoHoursAgo = readings.find((r, idx) => idx >= 4); // ~2 hours

    if (!oneHourAgo) return advice;

    // Temperature sudden drop (frost risk)
    const tempDrop =
      Number(oneHourAgo.temperature) - Number(latest.temperature);
    if (tempDrop >= 5) {
      advice.push({
        type: 'critical',
        category: 'temperature',
        message: `⚠️ ALERT: Temperature dropped ${tempDrop.toFixed(1)}°C in last hour! Risk of cold damage. Consider bringing plant indoors or adding frost protection.`,
        priority: 0,
        actionRequired: true,
      });
    }

    // Temperature sudden spike (heat stress)
    const tempSpike =
      Number(latest.temperature) - Number(oneHourAgo.temperature);
    if (tempSpike >= 5) {
      advice.push({
        type: 'critical',
        category: 'temperature',
        message: `⚠️ ALERT: Temperature rose ${tempSpike.toFixed(1)}°C in last hour! Risk of heat stress. Provide shade or move to cooler location immediately.`,
        priority: 0,
        actionRequired: true,
      });
    }

    // Moisture sudden drop (possible leak or drainage issue)
    if (twoHoursAgo) {
      const moistureDrop =
        Number(twoHoursAgo.moisture) - Number(latest.moisture);
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

    // Light sudden drop (weather change)
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

  // Existing: Analyze current conditions
  private analyzeCurrentConditions(statistics: any, thresholds: any) {
    const advice: AdviceItem[] = [];

    // Temperature
    const currentTemp = statistics.temperature.current;
    if (currentTemp < thresholds.temperature.min) {
      advice.push({
        type: 'warning',
        category: 'temperature',
        message: `Temperature is too low (${currentTemp}°C). Move to warmer location or add heat protection.`,
        priority: 1,
      });
    } else if (currentTemp > thresholds.temperature.max) {
      advice.push({
        type: 'warning',
        category: 'temperature',
        message: `Temperature is too high (${currentTemp}°C). Provide shade or move to cooler location.`,
        priority: 1,
      });
    } else if (
      currentTemp >= thresholds.temperature.ideal.min &&
      currentTemp <= thresholds.temperature.ideal.max
    ) {
      advice.push({
        type: 'success',
        category: 'temperature',
        message: `Temperature is ideal (${currentTemp}°C).`,
        priority: 3,
      });
    }

    // Moisture
    const currentMoisture = statistics.moisture.current;
    if (currentMoisture < thresholds.moisture.min) {
      advice.push({
        type: 'critical',
        category: 'moisture',
        message: `Soil is too dry (${currentMoisture}%). Water your plant immediately!`,
        priority: 0,
        actionRequired: true,
      });
    } else if (currentMoisture > thresholds.moisture.max) {
      advice.push({
        type: 'warning',
        category: 'moisture',
        message: `Soil is too wet (${currentMoisture}%). Risk of root rot. Stop watering and ensure drainage.`,
        priority: 1,
        actionRequired: true,
      });
    } else if (
      currentMoisture >= thresholds.moisture.ideal.min &&
      currentMoisture <= thresholds.moisture.ideal.max
    ) {
      advice.push({
        type: 'success',
        category: 'moisture',
        message: `Soil moisture is perfect (${currentMoisture}%).`,
        priority: 3,
      });
    }

    // Light
    const currentLight = statistics.light.current;
    if (currentLight < thresholds.light.min) {
      advice.push({
        type: 'warning',
        category: 'light',
        message: `Light intensity is too low (${currentLight} lux). Move to brighter location or add grow lights.`,
        priority: 1,
      });
    } else if (currentLight > thresholds.light.max) {
      advice.push({
        type: 'warning',
        category: 'light',
        message: `Light intensity is too high (${currentLight} lux). Provide shade to prevent leaf burn.`,
        priority: 1,
      });
    } else if (
      currentLight >= thresholds.light.ideal.min &&
      currentLight <= thresholds.light.ideal.max
    ) {
      advice.push({
        type: 'success',
        category: 'light',
        message: `Light intensity is excellent (${currentLight} lux).`,
        priority: 3,
      });
    }

    return advice;
  }

  // NEW: Analyze user care history
  private async analyzeCareHistory(
    plantId: number,
    userId: number,
    plant: any,
  ) {
    const advice: AdviceItem[] = [];

    // Get recent user actions
    const recentActions = await this.userActionsService.getRecentActions(
      plantId,
      userId,
      30, // Last 30 days
    );

    const now = new Date();
    const plantAge = Math.floor(
      (now.getTime() - new Date(plant.plantedDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Check last watering
    const lastWatered = recentActions.find((a) => a.actionType === 'watered');
    if (lastWatered) {
      const daysSinceWatered = Math.floor(
        (now.getTime() - new Date(lastWatered.actionDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceWatered >= 7) {
        advice.push({
          type: 'info',
          category: 'care',
          message: `You last watered this plant ${daysSinceWatered} days ago. Check soil moisture regularly.`,
          priority: 2,
        });
      }
    }

    // Check last fertilization
    const lastFertilized = recentActions.find(
      (a) => a.actionType === 'fertilized',
    );
    if (lastFertilized) {
      const daysSinceFertilized = Math.floor(
        (now.getTime() - new Date(lastFertilized.actionDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceFertilized >= 30) {
        advice.push({
          type: 'info',
          category: 'care',
          message: `Last fertilized ${daysSinceFertilized} days ago. Consider fertilizing if plant is in active growth.`,
          priority: 2,
        });
      }
    } else if (plantAge >= 30) {
      advice.push({
        type: 'info',
        category: 'care',
        message: `No fertilization recorded. Consider adding nutrients for healthy growth.`,
        priority: 2,
      });
    }

    // Check soil change
    const lastSoilChange = recentActions.find(
      (a) => a.actionType === 'soil_changed',
    );
    if (!lastSoilChange && plantAge >= 180) {
      // 6 months
      advice.push({
        type: 'info',
        category: 'care',
        message: `Plant is ${Math.floor(plantAge / 30)} months old. Consider refreshing soil or repotting if growth has slowed.`,
        priority: 3,
      });
    }

    return advice;
  }

  // Existing: Trend analysis
  private analyzeTrends(statistics: any) {
    const advice: AdviceItem[] = [];

    // Moisture trend
    const moistureDiff =
      statistics.moisture.average - statistics.moisture.current;
    if (moistureDiff > 10) {
      advice.push({
        type: 'info',
        category: 'moisture',
        message:
          'Moisture levels are below recent average. May need more frequent watering.',
        priority: 2,
      });
    } else if (moistureDiff < -10) {
      advice.push({
        type: 'info',
        category: 'moisture',
        message:
          'Moisture levels are higher than usual. Monitor for overwatering.',
        priority: 2,
      });
    }

    return advice;
  }

  private calculateAverage(numbers: number[]): number {
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 100) / 100;
  }
}
