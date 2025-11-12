"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const flower_module_1 = require("./modules/flower/flower.module");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const auth_module_1 = require("./modules/auth/auth.module");
const plants_module_1 = require("./modules/plants/plants.module");
const user_module_1 = require("./modules/users/user.module");
const sensor_readings_module_1 = require("./modules/sensor-readings/sensor-readings.module");
const db_config_1 = require("./config/db.config");
const advice_module_1 = require("./modules/advice/advice.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: (0, path_1.join)(process.cwd(), '.env'),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: db_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            flower_module_1.FlowerModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            plants_module_1.PlantsModule,
            sensor_readings_module_1.SensorReadingsModule,
            advice_module_1.AdviceModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map