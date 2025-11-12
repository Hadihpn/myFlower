"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfigInit = SwaggerConfigInit;
const swagger_1 = require("@nestjs/swagger");
function SwaggerConfigInit(app) {
    const document = new swagger_1.DocumentBuilder()
        .setTitle("Snappfood API")
        .setDescription("Snappfood API description")
        .setVersion("0.0.0")
        .addBearerAuth(SwaggerAuthConfig(), "Authorization")
        .build();
    const swagger = swagger_1.SwaggerModule.createDocument(app, document);
    swagger_1.SwaggerModule.setup("/swagger", app, swagger);
}
function SwaggerAuthConfig() {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer",
    };
}
//# sourceMappingURL=swagger.config.js.map