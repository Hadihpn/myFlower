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
exports.UserActionEntity = void 0;
const typeorm_1 = require("typeorm");
const plant_entity_1 = require("../../plants/entities/plant.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const user_actions_enum_1 = require("../enum/user-actions.enum");
const entity_name_enum_1 = require("../../../common/enums/entity-name.enum");
let UserActionEntity = class UserActionEntity {
    id;
    actionType;
    notes;
    actionDate;
    createdAt;
    plant;
    plantId;
    user;
    userId;
};
exports.UserActionEntity = UserActionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserActionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_actions_enum_1.ActionType,
    }),
    __metadata("design:type", String)
], UserActionEntity.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserActionEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserActionEntity.prototype, "actionDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserActionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plant_entity_1.PlantEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'plantId' }),
    __metadata("design:type", plant_entity_1.PlantEntity)
], UserActionEntity.prototype, "plant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserActionEntity.prototype, "plantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], UserActionEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserActionEntity.prototype, "userId", void 0);
exports.UserActionEntity = UserActionEntity = __decorate([
    (0, typeorm_1.Entity)(entity_name_enum_1.EntityEnums.UserActions)
], UserActionEntity);
//# sourceMappingURL=user-action.entity.js.map