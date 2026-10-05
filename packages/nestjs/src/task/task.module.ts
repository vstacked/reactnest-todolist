import { Module } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { TaskController } from './task.controller.js';
import { Task } from './entities/task.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
