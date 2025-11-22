import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Plant Maintenance API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let plantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('Authentication', () => {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';

    it('/api/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          fullName: 'Test User',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('token');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user.email).toBe(testEmail);
          authToken = response.body.token;
          userId = response.body.user.id;
        });
    });

    it('/api/auth/register (POST) - should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          fullName: 'Test User',
        })
        .expect(409);
    });

    it('/api/auth/login (POST) - should login successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('token');
          expect(response.body.user.email).toBe(testEmail);
        });
    });

    it('/api/auth/login (POST) - should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Plants', () => {
    it('/api/plants (POST) - should create a new plant', () => {
      return request(app.getHttpServer())
        .post('/api/plants')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Tomato',
          species: 'Tomato',
          description: 'E2E test plant',
          location: 'Test Garden',
          plantedDate: '2024-01-15',
          deviceId: `TEST_DEVICE_${Date.now()}`,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Test Tomato');
          plantId = response.body.id;
        });
    });

    it('/api/plants (GET) - should get all user plants', () => {
      return request(app.getHttpServer())
        .get('/api/plants')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/api/plants/:id (GET) - should get plant by id', () => {
      return request(app.getHttpServer())
        .get(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(plantId);
          expect(response.body.name).toBe('Test Tomato');
        });
    });

    it('/api/plants/:id (PUT) - should update plant', () => {
      return request(app.getHttpServer())
        .put(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Tomato',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated Tomato');
        });
    });

    it('/api/plants (POST) - should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/plants')
        .send({
          name: 'Test Plant',
          species: 'Tomato',
          deviceId: 'DEVICE_001',
        })
        .expect(401);
    });
  });

  describe('Sensor Readings', () => {
    let deviceId: string;

    beforeAll(async () => {
      // Get the device ID from the created plant
      const response = await request(app.getHttpServer())
        .get(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`);
      deviceId = response.body.deviceId;
    });

    it('/api/sensor-readings (POST) - should create sensor reading', () => {
      return request(app.getHttpServer())
        .post('/api/sensor-readings')
        .send({
          deviceId: deviceId,
          temperature: 24.5,
          moisture: 65.3,
          light: 28000,
          timestamp: new Date().toISOString(),
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.temperature).toBe(24.5);
        });
    });

    it('/api/sensor-readings/plant/:plantId/latest (GET) - should get latest reading', () => {
      return request(app.getHttpServer())
        .get(`/api/sensor-readings/plant/${plantId}/latest`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('temperature');
          expect(response.body).toHaveProperty('moisture');
          expect(response.body).toHaveProperty('light');
        });
    });
  });

  describe('User Actions', () => {
    it('/api/user-actions/plant/:plantId (POST) - should record action', () => {
      return request(app.getHttpServer())
        .post(`/api/user-actions/plant/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          actionType: 'watered',
          notes: 'E2E test watering',
          actionDate: new Date().toISOString(),
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.actionType).toBe('watered');
        });
    });

    it('/api/user-actions/plant/:plantId (GET) - should get all actions', () => {
      return request(app.getHttpServer())
        .get(`/api/user-actions/plant/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('Advice', () => {
    it('/api/advice/plant/:plantId (GET) - should get plant advice', () => {
      return request(app.getHttpServer())
        .get(`/api/advice/plant/${plantId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('advice');
          expect(response.body).toHaveProperty('overallHealth');
          expect(Array.isArray(response.body.advice)).toBe(true);
        });
    });
  });

  describe('Health Check', () => {
    it('/api/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('ok');
          expect(response.body).toHaveProperty('info');
        });
    });
  });
});