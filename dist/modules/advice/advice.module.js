"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdviceModule = void 0;
const common_1 = require("@nestjs/common");
const advice_service_1 = require("./advice.service");
const advice_controller_1 = require("./advice.controller");
const typeorm_1 = require("@nestjs/typeorm");
const plants_service_1 = require("../plants/plants.service");
const plant_entity_1 = require("../plants/entities/plant.entity");
const auth_module_1 = require("../auth/auth.module");
const user_actions_service_1 = require("../user-actions/user-actions.service");
const sensor_readings_service_1 = require("../sensor-readings/sensor-readings.service");
const user_action_entity_1 = require("../user-actions/entities/user-action.entity");
const sensor_reading_entity_1 = require("../sensor-readings/entities/sensor-reading.entity");
let AdviceModule = class AdviceModule {
};
exports.AdviceModule = AdviceModule;
exports.AdviceModule = AdviceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                plant_entity_1.PlantEntity,
                sensor_reading_entity_1.SensorReadingEntity,
                user_action_entity_1.UserActionEntity,
            ]),
        ],
        controllers: [advice_controller_1.AdviceController],
        providers: [
            advice_service_1.AdviceService,
            plants_service_1.PlantsService,
            user_actions_service_1.UserActionsService,
            sensor_readings_service_1.SensorReadingsService,
        ],
    })
], AdviceModule);
//# sourceMappingURL=advice.module.js.map