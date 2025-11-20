"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuth = UserAuth;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../modules/auth/guards/auth.guard");
function UserAuth() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)('Authorization'), (0, common_1.UseGuards)(auth_guard_1.AuthGuard));
}
//# sourceMappingURL=auth.decorator.js.map