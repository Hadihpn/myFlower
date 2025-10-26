"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoolean = isBoolean;
exports.toBoolean = toBoolean;
function isBoolean(value) {
    return ['true', true, 'false', false].includes(value);
}
function toBoolean(value) {
    return [true, 'true'].includes(value) ? true : [false, "false"].includes(value) ? false : value;
}
//# sourceMappingURL=function.utils.js.map