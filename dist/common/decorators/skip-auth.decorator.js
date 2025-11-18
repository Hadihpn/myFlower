"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAuth = exports.SKIP_AUTH = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_AUTH = 'SKIP_AUTH';
const SkipAuth = () => (0, common_1.SetMetadata)(exports.SKIP_AUTH, true);
exports.SkipAuth = SkipAuth;
//# sourceMappingURL=skip-auth.decorator.js.map