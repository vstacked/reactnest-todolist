import { Task } from '../src/task/entities/task.entity.js';

/**
 * A tiny stand-in for Repository<Task> that keeps tasks in an array.
 * It only implements the methods TasksService actually calls.
 */

export class InMemoryTasksRepository {
  private tasks: Task[] = [];
  private nextId = 1;

  create(data: Partial<Task>): Task {
    return Object.assign(new Task(), data);
  }

  async save(task: Task): Promise<Task> {
    if (!task.id) {
      task.id = this.nextId++;
      this.tasks.push(task);
    }
    return task;
  }

  async find(): Promise<Task[]> {
    return [...this.tasks];
  }

  async findOneBy(where: { id: number }): Promise<Task | null> {
    return this.tasks.find((task) => task.id === where.id) ?? null;
  }

  merge(task: Task, data: Partial<Task>): Task {
    return Object.assign(task, data);
  }

  async remove(task: Task): Promise<Task> {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    return task;
  }
}
