import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InMemoryTasksRepository } from '../../test/in-memory-tasks.repository.js';
import { Task } from './entities/task.entity.js';
import { TaskService } from './task.service.js';

describe('TasksService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: new InMemoryTasksRepository(),
        },
      ],
    }).compile();

    service = moduleRef.get(TaskService);
  });

  it('creates a task with a generated id', async () => {
    const task = await service.create({
      title: 'Write tests',
      description: 'Part 11',
    });

    expect(task).toEqual({
      id: 1,
      title: 'Write tests',
      description: 'Part 11',
    });
  });

  it('returns every created task', async () => {
    await service.create({ title: 'First', description: '' });
    await service.create({ title: 'Second', description: '' });

    const tasks = await service.findAll();

    expect(tasks.map((task) => task.title)).toEqual(['First', 'Second']);
  });

  it('throws NotFoundException for an unknown id', async () => {
    await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
  });

  it('updates an existing task', async () => {
    const { id } = await service.create({ title: 'Old', description: 'Old' });

    const updated = await service.update(id, {
      title: 'New',
      description: 'New',
    });

    expect(updated).toEqual({ id, title: 'New', description: 'New' });
  });

  it('throws NotFoundException when updating an unknown task', async () => {
    await expect(
      service.update(42, { title: 'Nope', description: '' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove a task', async () => {
    const { id } = await service.create({ title: 'Temp', description: '' });

    await service.remove(id);

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });
});
