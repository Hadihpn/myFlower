"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const ormconfig_1 = __importDefault(require("../../ormconfig"));
const user_entity_1 = require("../../modules/users/entities/user.entity");
const plant_entity_1 = require("../../modules/plants/entities/plant.entity");
const sensor_reading_entity_1 = require("../../modules/sensor-readings/entities/sensor-reading.entity");
const user_action_entity_1 = require("../../modules/user-actions/entities/user-action.entity");
const user_actions_enum_1 = require("../../modules/user-actions/enum/user-actions.enum");
async function seed() {
    console.log('🌱 Starting database seed...\n');
    await ormconfig_1.default.initialize();
    console.log('🔄 Running migrations...');
    await ormconfig_1.default.runMigrations();
    console.log('✅ Migrations completed\n');
    console.log('🗑️  Clearing existing data...');
    try {
        await ormconfig_1.default.getRepository(user_action_entity_1.UserActionEntity).clear();
    }
    catch (e) {
        console.log('⏭️  user_actions table not found, skipping...');
    }
    try {
        await ormconfig_1.default.getRepository(sensor_reading_entity_1.SensorReadingEntity).clear();
    }
    catch (e) {
        console.log('⏭️  sensor_readings table not found, skipping...');
    }
    try {
        await ormconfig_1.default.getRepository(plant_entity_1.PlantEntity).clear();
    }
    catch (e) {
        console.log('⏭️  plants table not found, skipping...');
    }
    try {
        await ormconfig_1.default.getRepository(user_entity_1.UserEntity).clear();
    }
    catch (e) {
        console.log('⏭️  users table not found, skipping...');
    }
    console.log('👤 Creating users...');
    const userRepo = ormconfig_1.default.getRepository(user_entity_1.UserEntity);
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user1 = await userRepo.save({
        email: 'john@example.com',
        password: hashedPassword,
        fullName: 'John Doe',
        phone: '+989355864811',
    });
    const user2 = await userRepo.save({
        email: 'jane@example.com',
        password: hashedPassword,
        fullName: 'Jane Smith',
        phoneNumber: '+989224837505',
    });
    console.log(`✅ Created ${2} users`);
    console.log('🌿 Creating plants...');
    const plantRepo = ormconfig_1.default.getRepository(plant_entity_1.PlantEntity);
    const plant1 = await plantRepo.save({
        name: "John's Tomato Plant",
        species: 'Tomato',
        description: 'Cherry tomato in the backyard',
        location: 'Backyard Garden',
        plantedDate: new Date('2024-01-15'),
        deviceId: 'DEVICE_001',
        userId: user1.id,
        status: 'active',
    });
    const plant2 = await plantRepo.save({
        name: "John's Rose Bush",
        species: 'Rose',
        description: 'Beautiful red roses',
        location: 'Front Yard',
        plantedDate: new Date('2024-02-01'),
        deviceId: 'DEVICE_002',
        userId: user1.id,
        status: 'active',
    });
    const plant3 = await plantRepo.save({
        name: "Jane's Basil",
        species: 'Basil',
        description: 'Fresh basil for cooking',
        location: 'Kitchen Window',
        plantedDate: new Date('2024-03-10'),
        deviceId: 'DEVICE_003',
        userId: user2.id,
        status: 'active',
    });
    console.log(`✅ Created ${3} plants`);
    console.log('📊 Creating sensor readings...');
    const readingRepo = ormconfig_1.default.getRepository(sensor_reading_entity_1.SensorReadingEntity);
    const now = new Date();
    const readings = [];
    for (const plant of [plant1, plant2, plant3]) {
        for (let day = 6; day >= 0; day--) {
            for (let hour = 0; hour < 24; hour++) {
                for (let half = 0; half < 2; half++) {
                    const timestamp = new Date(now);
                    timestamp.setDate(timestamp.getDate() - day);
                    timestamp.setHours(hour);
                    timestamp.setMinutes(half * 30);
                    timestamp.setSeconds(0);
                    const baseTemp = plant.species === 'Tomato' ? 24 : plant.species === 'Rose' ? 22 : 25;
                    const baseMoisture = plant.species === 'Tomato' ? 65 : plant.species === 'Rose' ? 55 : 60;
                    const baseLight = 20000;
                    const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 5;
                    const temperature = baseTemp + tempVariation + (Math.random() * 2 - 1);
                    const moistureVariation = hour > 6 && hour < 20 ? -5 : 2;
                    const moisture = baseMoisture + moistureVariation + (Math.random() * 3 - 1.5);
                    const lightVariation = hour >= 6 && hour <= 18
                        ? Math.sin(((hour - 6) / 12) * Math.PI) * baseLight
                        : 0;
                    const light = lightVariation + (Math.random() * 2000);
                    readings.push({
                        temperature: Math.round(temperature * 100) / 100,
                        moisture: Math.round(moisture * 100) / 100,
                        light: Math.round(light * 100) / 100,
                        timestamp,
                        plantId: plant.id,
                    });
                }
            }
        }
    }
    await readingRepo.save(readings);
    console.log(`✅ Created ${readings.length} sensor readings`);
    console.log('📝 Creating user actions...');
    const actionRepo = ormconfig_1.default.getRepository(user_action_entity_1.UserActionEntity);
    const actions = [
        {
            actionType: user_actions_enum_1.ActionType.WATERED,
            notes: 'Watered thoroughly, soil was dry',
            actionDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            plantId: plant1.id,
            userId: user1.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.FERTILIZED,
            notes: 'Applied organic fertilizer',
            actionDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
            plantId: plant1.id,
            userId: user1.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.PRUNED,
            notes: 'Removed dead leaves',
            actionDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            plantId: plant1.id,
            userId: user1.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.WATERED,
            notes: 'Light watering',
            actionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            plantId: plant2.id,
            userId: user1.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.PESTICIDE_APPLIED,
            notes: 'Applied neem oil for aphids',
            actionDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            plantId: plant2.id,
            userId: user1.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.WATERED,
            notes: 'Daily watering',
            actionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            plantId: plant3.id,
            userId: user2.id,
        },
        {
            actionType: user_actions_enum_1.ActionType.SOIL_CHANGED,
            notes: 'Repotted with fresh soil',
            actionDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            plantId: plant3.id,
            userId: user2.id,
        },
    ];
    await actionRepo.save(actions);
    console.log(`✅ Created ${actions.length} user actions`);
    await ormconfig_1.default.destroy();
    console.log('\n✨ Database seeded successfully!\n');
    console.log('📧 Test User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: Password123!');
    console.log('');
    console.log('   Email: jane@example.com');
    console.log('   Password: Password123!\n');
}
seed()
    .then(() => {
    console.log('Done!');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map