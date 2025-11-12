"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorReadingsModule = void 0;
const common_1 = require("@nestjs/common");
const sensor_readings_service_1 = require("./sensor-readings.service");
const sensor_readings_controller_1 = require("./sensor-readings.controller");
const auth_module_1 = require("../auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const sensor_reading_entity_1 = require("./entities/sensor-reading.entity");
const plants_service_1 = require("../plants/plants.service");
const plant_entity_1 = require("../plants/entities/plant.entity");
let SensorReadingsModule = class SensorReadingsModule {
};
exports.SensorReadingsModule = SensorReadingsModule;
exports.SensorReadingsModule = SensorReadingsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([sensor_reading_entity_1.SensorReadingEntity, plant_entity_1.PlantEntity])],
        controllers: [sensor_readings_controller_1.SensorReadingsController],
        providers: [sensor_readings_service_1.SensorReadingsService, plants_service_1.PlantsService],
    })
], SensorReadingsModule);
//# sourceMappingURL=sensor-readings.module.js.map