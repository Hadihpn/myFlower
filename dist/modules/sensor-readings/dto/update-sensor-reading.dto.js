"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSensorReadingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sensor_reading_dto_1 = require("./create-sensor-reading.dto");
class UpdateSensorReadingDto extends (0, swagger_1.PartialType)(create_sensor_reading_dto_1.CreateSensorReadingDto) {
}
exports.UpdateSensorReadingDto = UpdateSensorReadingDto;
//# sourceMappingURL=update-sensor-reading.dto.js.map