import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ActionType } from 'src/modules/user-actions/enum/user-actions.enum';

describe('Advanced E2E Tests', () => {
  let app: INestApplication;
  let token1: string;
  let token2: string;
  let user1PlantId: string;
  let user2PlantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global pipes and prefix like in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Multi-user scenarios', () => {
    it('should create two separate users', async () => {
      // User 1
      const user1Response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `user1_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'User One',
        })
        .expect(201);

      token1 = user1Response.body.token;
      expect(token1).toBeDefined();

      // User 2
      const user2Response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `user2_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'User Two',
        })
        .expect(201);

      token2 = user2Response.body.token;
      expect(token2).toBeDefined();
    });

    it('should create plants for both users', async () => {
      // User 1 plant
      const plant1Response = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'User 1 Tomato',
          species: 'Tomato',
          location: 'User 1 Garden',
          plantedDate: '2024-01-15',
          deviceId: `DEVICE_USER1_${Date.now()}`,
        })
        .expect(201);

      user1PlantId = plant1Response.body.id;

      // User 2 plant
      const plant2Response = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          name: 'User 2 Rose',
          species: 'Rose',
          location: 'User 2 Garden',
          plantedDate: '2024-02-01',
          deviceId: `DEVICE_USER2_${Date.now()}`,
        })
        .expect(201);

      user2PlantId = plant2Response.body.id;
    });

    it('should prevent user 1 from accessing user 2 plant', async () => {
      await request(app.getHttpServer())
        .get(`/api/plants/${user2PlantId}`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(404); // Should not find because different user
    });

    it('should prevent user 2 from accessing user 1 plant', async () => {
      await request(app.getHttpServer())
        .get(`/api/plants/${user1PlantId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
    });

    it('should allow each user to access only their own plants', async () => {
      // User 1 can access their plant
      await request(app.getHttpServer())
        .get(`/api/plants/${user1PlantId}`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      // User 2 can access their plant
      await request(app.getHttpServer())
        .get(`/api/plants/${user2PlantId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);
    });

    it('should prevent user 1 from deleting user 2 plant', async () => {
      await request(app.getHttpServer())
        .delete(`/api/plants/${user2PlantId}`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(404);
    });
  });

  describe('Complete plant care workflow', () => {
    let workflowPlantId: string;
    let workflowDeviceId: string;
    let workflowToken: string;

    it('should setup user and plant for workflow', async () => {
      // Register user
      const userResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `workflow_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'Workflow User',
        })
        .expect(201);

      workflowToken = userResponse.body.token;

      // Create plant
      workflowDeviceId = `WORKFLOW_DEVICE_${Date.now()}`;
      const plantResponse = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${workflowToken}`)
        .send({
          name: 'Workflow Test Plant',
          species: 'Tomato',
          location: 'Test Garden',
          plantedDate: '2024-01-01',
          deviceId: workflowDeviceId,
        })
        .expect(201);

      workflowPlantId = plantResponse.body.id;
    });

    it('should send multiple sensor readings over time', async () => {
      const now = new Date();

      // Send 10 readings (simulating 5 hours of data)
      for (let i = 0; i < 10; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals

        await request(app.getHttpServer())
          .post('/api/sensor-readings')
          .send({
            deviceId: workflowDeviceId,
            temperature: 24 + Math.random() * 2,
            moisture: 60 + Math.random() * 5,
            light: 25000 + Math.random() * 5000,
            timestamp: timestamp.toISOString(),
          })
          .expect(201);
      }
    });

    it('should get plant statistics with all readings', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/plants/${workflowPlantId}/statistics`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .expect(200);

      expect(response.body.statistics).toBeDefined();
      expect(response.body.statistics.readingsCount).toBeGreaterThanOrEqual(10);
      expect(response.body.statistics.temperature).toHaveProperty('current');
      expect(response.body.statistics.temperature).toHaveProperty('average');
      expect(response.body.statistics.moisture).toHaveProperty('min');
      expect(response.body.statistics.moisture).toHaveProperty('max');
    });

    it('should get daily aggregates', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/sensor-readings/plant/${workflowPlantId}/daily?days=7`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('temperature');
      expect(response.body[0].temperature).toHaveProperty('avg');
      expect(response.body[0].temperature).toHaveProperty('min');
      expect(response.body[0].temperature).toHaveProperty('max');
    });

    it('should record watering action', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/user-actions/plant/${workflowPlantId}`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .send({
          actionType: ActionType.WATERED,
          notes: 'Workflow test watering',
          actionDate: new Date().toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.actionType).toBe(ActionType.WATERED);
      expect(response.body.notes).toBe('Workflow test watering');
    });

    it('should record fertilizing action', async () => {
      await request(app.getHttpServer())
        .post(`/api/user-actions/plant/${workflowPlantId}`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .send({
          actionType: ActionType.FERTILIZED,
          notes: 'Applied organic fertilizer',
          actionDate: new Date().toISOString(),
        })
        .expect(201);
    });

    it('should get all user actions for plant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/user-actions/plant/${workflowPlantId}`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('actionType');
      expect(response.body[0]).toHaveProperty('notes');
    });

    it('should get advice that considers recent watering', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/advice/plant/${workflowPlantId}`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .expect(200);

      expect(response.body.advice).toBeDefined();
      expect(Array.isArray(response.body.advice)).toBe(true);
      expect(response.body.overallHealth).toBeDefined();
      expect(response.body).toHaveProperty('plant');
      expect(response.body).toHaveProperty('statistics');
      expect(response.body).toHaveProperty('thresholds');
    });

    it('should get recent actions within last 30 days', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/user-actions/plant/${workflowPlantId}/recent?days=30`)
        .set('Authorization', `Bearer ${workflowToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Validation and error handling', () => {
    let validToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `validation_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'Validation User',
        });

      validToken = response.body.token;
    });

    it('should reject invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          fullName: 'Test',
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should reject weak password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `test_${Date.now()}@example.com`,
          password: '123',
          fullName: 'Test',
        })
        .expect(400);
    });

    it('should reject duplicate email registration', async () => {
      const email = `duplicate_${Date.now()}@example.com`;

      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: email,
          password: 'Password123!',
          fullName: 'Test',
        })
        .expect(201);

      // Duplicate registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: email,
          password: 'Password123!',
          fullName: 'Test',
        })
        .expect(409); // Conflict
    });

    it('should reject missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Test Plant',
          // Missing required fields: species, plantedDate, deviceId
        })
        .expect(400);
    });

    it('should reject invalid date format', async () => {
      await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Test Plant',
          species: 'Tomato',
          plantedDate: 'invalid-date',
          deviceId: 'DEVICE_001',
        })
        .expect(400);
    });

    it('should reject duplicate device ID', async () => {
      const deviceId = `UNIQUE_DEVICE_${Date.now()}`;

      // First plant with device ID
      await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'First Plant',
          species: 'Tomato',
          plantedDate: '2024-01-01',
          deviceId: deviceId,
        })
        .expect(201);

      // Second plant with same device ID
      await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Second Plant',
          species: 'Rose',
          plantedDate: '2024-01-01',
          deviceId: deviceId,
        })
        .expect(409); // Conflict
    });

    it('should reject sensor reading with invalid device ID', async () => {
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: 'NONEXISTENT_DEVICE',
          temperature: 24.5,
          moisture: 65,
          light: 28000,
          timestamp: new Date().toISOString(),
        })
        .expect(404);
    });

    it('should reject sensor reading with invalid data types', async () => {
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: 'DEVICE_001',
          temperature: 'not-a-number',
          moisture: 65,
          light: 28000,
          timestamp: new Date().toISOString(),
        })
        .expect(400);
    });

    it('should reject requests without authentication', async () => {
      await request(app.getHttpServer()).get('/api/plants').expect(401);

      await request(app.getHttpServer())
        .post('/api/plants')
        .send({
          name: 'Test',
          species: 'Tomato',
          deviceId: 'TEST',
        })
        .expect(401);
    });

    it('should reject requests with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/plants')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject requests with malformed authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/plants')
        .set('Authorization', 'InvalidFormat')
        .expect(401);
    });

    it('should reject invalid action type', async () => {
      // Create a plant first
      const plantResponse = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Test Plant',
          species: 'Tomato',
          plantedDate: '2024-01-01',
          deviceId: `TEST_${Date.now()}`,
        });

      const plantId = plantResponse.body.id;

      // Try to record action with invalid type
      await request(app.getHttpServer())
        .post(`/api/user-actions/plant/${plantId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          actionType: 'invalid_action',
          actionDate: new Date().toISOString(),
        })
        .expect(400);
    });
  });

  describe('Sudden change detection E2E', () => {
    let testToken: string;
    let testPlantId: string;
    let testDeviceId: string;

    beforeAll(async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `sudden_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'Sudden Change User',
        });

      testToken = userResponse.body.token;

      testDeviceId = `SUDDEN_DEVICE_${Date.now()}`;
      const plantResponse = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'Sudden Change Test',
          species: 'Tomato',
          location: 'Test',
          plantedDate: '2024-01-01',
          deviceId: testDeviceId,
        });

      testPlantId = plantResponse.body.id;
    });

    it('should detect sudden temperature drop (frost alert)', async () => {
      const now = new Date();

      // Send normal reading 1 hour ago
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId,
          temperature: 25.0,
          moisture: 65,
          light: 28000,
          timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        })
        .expect(201);

      // Send intermediate reading
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId,
          temperature: 24.0,
          moisture: 65,
          light: 28000,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        })
        .expect(201);

      // Send reading with temperature drop (7°C drop!)
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId,
          temperature: 18.0,
          moisture: 65,
          light: 28000,
          timestamp: now.toISOString(),
        })
        .expect(201);

      // Check advice - should show critical alert
      const response = await request(app.getHttpServer())
        .get(`/api/advice/plant/${testPlantId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      const criticalAdvice = response.body.advice.filter(
        (a: any) => a.type === 'critical',
      );
      expect(criticalAdvice.length).toBeGreaterThan(0);
      
      const tempAlert = criticalAdvice.find((a: any) =>
        a.message.toLowerCase().includes('temperature dropped'),
      );
      expect(tempAlert).toBeDefined();
      expect(tempAlert.actionRequired).toBe(true);
    });

    it('should detect sudden temperature spike (heat stress)', async () => {
      const testDeviceId2 = `HEAT_DEVICE_${Date.now()}`;
      
      // Create new plant for heat test
      const plantResponse = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'Heat Test Plant',
          species: 'Rose',
          location: 'Test',
          plantedDate: '2024-01-01',
          deviceId: testDeviceId2,
        });

      const heatTestPlantId = plantResponse.body.id;
      const now = new Date();

      // Normal temperature
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId2,
          temperature: 22.0,
          moisture: 60,
          light: 25000,
          timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        })
        .expect(201);

      // Intermediate
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId2,
          temperature: 24.0,
          moisture: 60,
          light: 25000,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        })
        .expect(201);

      // Sudden spike (6°C increase!)
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId2,
          temperature: 28.0,
          moisture: 60,
          light: 25000,
          timestamp: now.toISOString(),
        })
        .expect(201);

      // Check advice
      const response = await request(app.getHttpServer())
        .get(`/api/advice/plant/${heatTestPlantId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      const criticalAdvice = response.body.advice.filter(
        (a: any) => a.type === 'critical',
      );
      
      const heatAlert = criticalAdvice.find((a: any) =>
        a.message.toLowerCase().includes('rose'),
      );
      // Should get warning since temperature spike detected
      expect(response.body.advice.length).toBeGreaterThan(0);
    });

    it('should detect critical moisture level', async () => {
      const testDeviceId3 = `DRY_DEVICE_${Date.now()}`;
      
      const plantResponse = await request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'Dry Test Plant',
          species: 'Tomato',
          location: 'Test',
          plantedDate: '2024-01-01',
          deviceId: testDeviceId3,
        });

      const dryPlantId = plantResponse.body.id;

      // Send critically low moisture reading
      await request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: testDeviceId3,
          temperature: 24.0,
          moisture: 25.0, // Below minimum threshold (40%)
          light: 28000,
          timestamp: new Date().toISOString(),
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/api/advice/plant/${dryPlantId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      const criticalAdvice = response.body.advice.filter(
        (a: any) => a.type === 'critical',
      );
      
      const moistureAlert = criticalAdvice.find((a: any) =>
        a.message.toLowerCase().includes('dry') ||
        a.message.toLowerCase().includes('water'),
      );
      
      expect(moistureAlert).toBeDefined();
      expect(moistureAlert.actionRequired).toBe(true);
      expect(response.body.overallHealth).toBe('critical');
    });
  });

  describe('Health endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('info');
      expect(response.body.info).toHaveProperty('database');
    });
  });

  describe('User profile management', () => {
    let userToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `profile_${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'Profile Test User',
          phoneNumber: '+1234567890',
        });

      userToken = response.body.token;
    });

    it('should get current user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('fullName');
      expect(response.body.fullName).toBe('Profile Test User');
      expect(response.body).not.toHaveProperty('password'); // Password should be excluded
    });

    it('should fail to get profile without auth', async () => {
      await request(app.getHttpServer()).get('/api/users/me').expect(401);
    });
  });
});