"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = exports.getDatabaseConfig = void 0;
const typeorm_1 = require("typeorm");
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
});
exports.getDatabaseConfig = getDatabaseConfig;
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: +process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'plant_maintenance',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=db.config.js.map