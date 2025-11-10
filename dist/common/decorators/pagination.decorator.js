"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = Pagination;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function Pagination(page = 1, limit = 10) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({ name: 'page', type: 'integer', example: page, required: false }), (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'limit',
        type: 'integer',
        example: limit,
        required: false,
    })));
}
//# sourceMappingURL=pagination.decorator.js.map