"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadingImage = void 0;
const common_1 = require("@nestjs/common");
const validatos_enum_1 = require("../enums/validatos.enum");
const UploadingImage = (fileType = validatos_enum_1.ValidatorsEnum.imageFileType, maxSize = validatos_enum_1.ValidatorsEnum.maxSizeCategoryImage) => {
    return (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize }),
            new common_1.FileTypeValidator({ fileType }),
        ],
    }));
};
exports.UploadingImage = UploadingImage;
//# sourceMappingURL=image.decorator.js.map