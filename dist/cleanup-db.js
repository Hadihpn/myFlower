"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ormconfig_1 = __importDefault(require("./src/ormconfig"));
async function cleanup() {
    await ormconfig_1.default.initialize();
    const queryRunner = ormconfig_1.default.createQueryRunner();
    try {
        console.log('Cleaning up database...');
        await queryRunner.query('DROP TABLE IF EXISTS "user_actions" CASCADE');
        await queryRunner.query('DROP TABLE IF EXISTS "sensor_readings" CASCADE');
        await queryRunner.query('DROP TABLE IF EXISTS "plant" CASCADE');
        await queryRunner.query('DROP TABLE IF EXISTS "user" CASCADE');
        await queryRunner.query('DROP TYPE IF EXISTS "user_actions_actiontype_enum"');
        console.log('Database cleaned successfully!');
    }
    catch (error) {
        console.error('Error cleaning database:', error);
    }
    finally {
        await ormconfig_1.default.destroy();
    }
}
cleanup();
//# sourceMappingURL=cleanup-db.js.map