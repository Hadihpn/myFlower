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
exports.SensorReadingEntity = void 0;
const typeorm_1 = require("typeorm");
const plant_entity_1 = require("../../plants/entities/plant.entity");
const entity_name_enum_1 = require("../../../common/enums/entity-name.enum");
let SensorReadingEntity = class SensorReadingEntity {
    id;
    temperature;
    moisture;
    light;
    timestamp;
    createdAt;
    plantId;
    plant;
};
exports.SensorReadingEntity = SensorReadingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SensorReadingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], SensorReadingEntity.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], SensorReadingEntity.prototype, "moisture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], SensorReadingEntity.prototype, "light", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SensorReadingEntity.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SensorReadingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SensorReadingEntity.prototype, "plantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plant_entity_1.PlantEntity, (plant) => plant.sensorReadings, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'plantId' }),
    __metadata("design:type", plant_entity_1.PlantEntity)
], SensorReadingEntity.prototype, "plant", void 0);
exports.SensorReadingEntity = SensorReadingEntity = __decorate([
    (0, typeorm_1.Entity)(entity_name_enum_1.EntityEnums.SensorReadings),
    (0, typeorm_1.Index)(['plantId', 'timestamp'])
], SensorReadingEntity);
//# sourceMappingURL=sensor-reading.entity.js.map