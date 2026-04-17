import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userUuid: string;
  let todoAppId: number;
  let taskId: number;

  const testEmail = `e2e-${Date.now()}@test.com`;
  const testPassword = 'TestPass123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('GET / should return Hello World', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Auth', () => {
    it('POST /auth/register should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword, name: 'E2E User' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      token = res.body.accessToken;
      userUuid = res.body.user.uuid;
    });

    it('POST /auth/login should authenticate', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      token = res.body.accessToken;
    });

    it('GET /auth/profile should return profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.email).toBe(testEmail);
    });

    it('should reject protected routes without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('Todo Apps', () => {
    it('POST /todo should create a todo app', async () => {
      const res = await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'E2E Test App' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe('E2E Test App');
      todoAppId = res.body.id;
    });

    it('GET /todo should list user todo apps', async () => {
      const res = await request(app.getHttpServer())
        .get('/todo')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /todo/:id should return the todo app', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todo/${todoAppId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.name).toBe('E2E Test App');
      expect(res.body.collaborators).toBeDefined();
    });
  });

  describe('Tasks', () => {
    it('POST /todo/:id/tasks should create a task', async () => {
      const res = await request(app.getHttpServer())
        .post(`/todo/${todoAppId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'E2E Task', status: 'TODO', priority: 'HIGH' })
        .expect(201);

      expect(res.body.title).toBe('E2E Task');
      expect(res.body.status).toBe('TODO');
      taskId = res.body.id;
    });

    it('GET /todo/:id/tasks should list tasks', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todo/${todoAppId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((t: any) => t.id === taskId)).toBe(true);
    });

    it('PATCH /todo/:id/tasks/:taskId should update a task', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/todo/${todoAppId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'DONE' })
        .expect(200);

      expect(res.body.status).toBe('DONE');
    });

    it('should filter tasks by status', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todo/${todoAppId}/tasks?status=TODO`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.every((t: any) => t.status === 'TODO')).toBe(true);
    });
  });

  describe('Dependencies', () => {
    let task2Id: number;
    let depId: number;

    it('should create a second task for dependency testing', async () => {
      const res = await request(app.getHttpServer())
        .post(`/todo/${todoAppId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Dep Target', status: 'TODO', priority: 'LOW' })
        .expect(201);

      task2Id = res.body.id;
    });

    it('POST /todo/:id/dependencies should create dependency', async () => {
      const res = await request(app.getHttpServer())
        .post(`/todo/${todoAppId}/dependencies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sourceTaskId: taskId, targetTaskId: task2Id })
        .expect(201);

      expect(res.body.sourceTaskId).toBe(taskId);
      expect(res.body.targetTaskId).toBe(task2Id);
      depId = res.body.id;
    });

    it('GET /todo/:id/dependencies should list dependencies', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todo/${todoAppId}/dependencies`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should reject circular dependency', async () => {
      await request(app.getHttpServer())
        .post(`/todo/${todoAppId}/dependencies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sourceTaskId: task2Id, targetTaskId: taskId })
        .expect(400);
    });

    it('DELETE /todo/:id/dependencies/:depId should remove', async () => {
      await request(app.getHttpServer())
        .delete(`/todo/${todoAppId}/dependencies/${depId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Activities', () => {
    it('GET /todo/:id/activities should return activity log', async () => {
      const res = await request(app.getHttpServer())
        .get(`/todo/${todoAppId}/activities`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.items).toBeDefined();
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  describe('Cleanup', () => {
    it('DELETE /todo/:id should delete the test app', async () => {
      await request(app.getHttpServer())
        .delete(`/todo/${todoAppId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
