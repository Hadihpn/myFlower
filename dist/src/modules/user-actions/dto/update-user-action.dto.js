"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserActionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_action_dto_1 = require("./create-user-action.dto");
class UpdateUserActionDto extends (0, swagger_1.PartialType)(create_user_action_dto_1.CreateUserActionDto) {
}
exports.UpdateUserActionDto = UpdateUserActionDto;
//# sourceMappingURL=update-user-action.dto.js.map