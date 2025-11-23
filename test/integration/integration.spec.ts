import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PlantsService } from 'src/modules/plants/plants.service';
import { UserActionsService } from 'src/modules/user-actions/user-actions.service';
import { SensorReadingsService } from 'src/modules/sensor-readings/sensor-readings.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserActionsModule } from 'src/modules/user-actions/user-actions.module';
import { PlantsModule } from 'src/modules/plants/plants.module';
import { SensorReadingsModule } from 'src/modules/sensor-readings/sensor-readings.module';
import { UserService } from 'src/modules/users/user.service';

describe('Plants Flow Integration', () => {
  let app: INestApplication;
  let plantsService: PlantsService;
  let usersService: UserService;
  let sensorReadingsService: SensorReadingsService;
  let testUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT.toString() || '5433'),
          username: process.env.DATABASE_USER || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'password',
          database: process.env.DATABASE_NAME || 'plant_test',
          entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
          synchronize: true, // OK for test database
        }),
        AuthModule,
        UserActionsModule,
        PlantsModule,
        SensorReadingsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    plantsService = moduleFixture.get<PlantsService>(PlantsService);
    usersService = moduleFixture.get<UserService>(UserService);
    sensorReadingsService = moduleFixture.get<SensorReadingsService>(
      SensorReadingsService,
    );

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await usersService.create({
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
      fullName: 'Test User',
    });
    testUserId = user.id;
});

  afterAll(async () => {
    await app.close();
  });

  it('should complete full plant lifecycle', async () => {
    // 1. Create plant
     const createPlantDto = {
        name: 'My Tomato',
        species: 'Tomato',
        location: 'Garden',
        status: 'active',
        plantedDate: '2024-01-15',
        deviceId: 'DEVICE_001',
      };
    const plant = await plantsService.create(testUserId, createPlantDto);

    expect(plant).toBeDefined();
    expect(plant.id).toBeDefined();
    expect(plant.name).toBe('Integration Test Plant');

    // 2. Add sensor readings
    const reading1 = await sensorReadingsService.create({
      deviceId: plant.deviceId,
      temperature: 24.5,
      moisture: 65,
      light: 28000,
      timestamp: new Date().toISOString(),
    });

    expect(reading1).toBeDefined();
    expect(reading1.plantId).toBe(plant.id);

    // 3. Get latest reading
    const latestReading = await sensorReadingsService.getLatestReading(
      plant.id,
      testUserId,
    );

    expect(latestReading).toBeDefined();
    expect(latestReading.temperature).toBe(24.5);

    // 4. Get plant statistics
    const stats = await plantsService.getPlantStatistics(plant.id, testUserId);

    expect(stats.statistics).toBeDefined();
    expect(stats.statistics?.readingsCount).toBeGreaterThan(0);

    // 5. Update plant
    const updatedPlant = await plantsService.update(plant.id, testUserId, {
      name: 'Updated Test Plant',
    });

    expect(updatedPlant.name).toBe('Updated Test Plant');

    // 6. Delete plant
    await plantsService.remove(plant.id, testUserId);

    // Verify deletion
    await expect(plantsService.findOne(plant.id, testUserId)).rejects.toThrow();
  });
});
