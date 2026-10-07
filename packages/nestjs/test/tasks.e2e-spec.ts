import { CacheModule } from '@nestjs/cache-manager';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Task } from '../src/task/entities/task.entity.js';
import { TaskController } from '../src/task/task.controller.js';
import { TaskService } from '../src/task/task.service.js';
import { InMemoryTasksRepository } from './in-memory-tasks.repository.js';

describe('/tasks (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true })],
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: new InMemoryTasksRepository(),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    //* Same options as in main.ts: global pipes are not part of any module
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a task and lists it', async () => {
    const created = await request(app.getHttpServer())
      .post('/task')
      .send({ title: 'Write e2e tests', description: 'Part 11' })
      .expect(201);

    expect(created.body).toEqual({
      id: 1,
      title: 'Write e2e tests',
      description: 'Part 11',
    });

    const list = await request(app.getHttpServer()).get('/task').expect(200);
    expect(list.body).toEqual([created.body]);
  });

  it('rejects a title that is too short', async () => {
    const response = await request(app.getHttpServer())
      .post('/task')
      .send({ title: 'ab', description: '' })
      .expect(400);

    expect(response.body.message).toContain(
      'title must be longer than or equal to 3 characters',
    );
  });

  it('rejects properties that are not in the DTO', async () => {
    return request(app.getHttpServer())
      .post('/task')
      .send({ title: 'Valid title', description: '', id: 5 })
      .expect(400);
  });

  it('returns 400 for a non-numeric id', async () => {
    return request(app.getHttpServer()).get('/task/abc').expect(400);
  });

  it('returns 400 for an unknown task', async () => {
    return request(app.getHttpServer()).get('/task/999').expect(404);
  });

  it('deletes a task', async () => {
    const server = app.getHttpServer();
    const { body } = await request(server)
      .post('/task')
      .send({ title: 'Temporary', description: '' })
      .expect(201);

    await request(server).delete(`/task/${body.id}`).expect(204);
    await request(server).get(`/task/${body.id}`).expect(404);
  });

  it('does not serve a stale list after a task is created', async () => {
    const server = app.getHttpServer();

    await request(server).get(`/task`).expect('X-Cache', 'MISS');
    await request(server).get(`/task`).expect('X-Cache', 'HIT');

    await request(server)
      .post('/task')
      .send({ title: 'Fresh task', description: '' })
      .expect(201);

    const list = await request(server).get('/task').expect(200);
    expect(list.body).toHaveLength(1);
  });
});
