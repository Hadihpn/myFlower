import { Injectable } from '@nestjs/common';
// import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { PlantsService } from '../plants/plants.service';
// import { AdviceItem } from './interface/advice.interface';

export interface AdviceItem {
  type: 'warning' | 'info' | 'success';
  category: 'temperature' | 'moisture' | 'light' | 'general';
  message: string;
  priority: number; // 1=high, 2=medium, 3=low
}

@Injectable()
export class AdviceService {
  // Plant-specific thresholds (can be extended to database later)
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
    // private sensorReadingsService: SensorReadingsService,
    private plantsService: PlantsService,
  ) {}

  async getAdviceForPlant(plantId: string, userId: string) {
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

    // Temperature advice
    const currentTemp = statistics.statistics.temperature.current;
    const avgTemp = statistics.statistics.temperature.average;

    if (currentTemp < thresholds.temperature.min) {
      advice.push({
        type: 'warning',
        category: 'temperature',
        message: `Temperature is too low (${currentTemp}°C). Consider moving plant to warmer location or providing heat protection.`,
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
    } else {
      advice.push({
        type: 'info',
        category: 'temperature',
        message: `Temperature is acceptable (${currentTemp}°C) but not optimal. Ideal range: ${thresholds.temperature.ideal.min}-${thresholds.temperature.ideal.max}°C.`,
        priority: 2,
      });
    }

    // Moisture advice
    const currentMoisture = statistics.statistics.moisture.current;
    const avgMoisture = statistics.statistics.moisture.average;

    if (currentMoisture < thresholds.moisture.min) {
      advice.push({
        type: 'warning',
        category: 'moisture',
        message: `Soil is too dry (${currentMoisture}%). Water your plant immediately!`,
        priority: 1,
      });
    } else if (currentMoisture > thresholds.moisture.max) {
      advice.push({
        type: 'warning',
        category: 'moisture',
        message: `Soil is too wet (${currentMoisture}%). Risk of root rot. Stop watering and ensure proper drainage.`,
        priority: 1,
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
    } else {
      advice.push({
        type: 'info',
        category: 'moisture',
        message: `Soil moisture is acceptable (${currentMoisture}%) but could be better. Ideal range: ${thresholds.moisture.ideal.min}-${thresholds.moisture.ideal.max}%.`,
        priority: 2,
      });
    }

    // Light advice
    const currentLight = statistics.statistics.light.current;
    const avgLight = statistics.statistics.light.average;

    if (currentLight < thresholds.light.min) {
      advice.push({
        type: 'warning',
        category: 'light',
        message: `Light intensity is too low (${currentLight} lux). Move plant to brighter location or add grow lights.`,
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
    } else {
      advice.push({
        type: 'info',
        category: 'light',
        message: `Light intensity is acceptable (${currentLight} lux). Ideal range: ${thresholds.light.ideal.min}-${thresholds.light.ideal.max} lux.`,
        priority: 2,
      });
    }

    // Trend analysis (comparing current vs average)
    if (avgMoisture < currentMoisture - 10) {
      advice.push({
        type: 'info',
        category: 'moisture',
        message: 'Moisture levels have increased recently. Monitor for overwatering.',
        priority: 2,
      });
    } else if (avgMoisture > currentMoisture + 10) {
      advice.push({
        type: 'info',
        category: 'moisture',
        message: 'Moisture levels are decreasing. May need more frequent watering.',
        priority: 2,
      });
    }

    // Overall health assessment
    const warnings = advice.filter((a) => a.type === 'warning').length;
    const successes = advice.filter((a) => a.type === 'success').length;

    let overallHealth: string;
    if (warnings === 0 && successes >= 2) {
      overallHealth = 'excellent';
    } else if (warnings === 0) {
      overallHealth = 'good';
    } else if (warnings <= 1) {
      overallHealth = 'fair';
    } else {
      overallHealth = 'needs attention';
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
}