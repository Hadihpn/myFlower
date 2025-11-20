"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    (0, swagger_config_1.SwaggerConfigInit)(app);
    await app.listen(process.env.PORT ?? 3000, () => {
        console.log(`
    🌱 Plant Maintenance API is running!
    
    📡 API: http://localhost:3000
    📚 Swagger Docs:http://127.0.0.1:3000/swagger
    
    Environment: ${process.env.NODE_ENV || 'development'}
  `);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map