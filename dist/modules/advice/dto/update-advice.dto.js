"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdviceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_advice_dto_1 = require("./create-advice.dto");
class UpdateAdviceDto extends (0, swagger_1.PartialType)(create_advice_dto_1.CreateAdviceDto) {
}
exports.UpdateAdviceDto = UpdateAdviceDto;
//# sourceMappingURL=update-advice.dto.js.map