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
exports.CreatePlantDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePlantDto {
    name;
    species;
    description;
    status;
    location;
    plantedDate;
    deviceId;
}
exports.CreatePlantDto = CreatePlantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'سانسوریا' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'مهتابی' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "species", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'توضیحات', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'محل نگهداری', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'تاریخ کاشت' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "plantedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "deviceId", void 0);
//# sourceMappingURL=create-plant.dto.js.map