import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto.js';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@ApiTags('task')
@Controller('task')
@UseInterceptors(CacheInterceptor)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: TaskDto,
  })
  @ApiBadRequestResponse({ description: 'The payload is invalid.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create(createTaskDto);
    await this.clearCache();
    return task;
  }

  @Get()
  @ApiOkResponse({
    description: 'The list of all task.',
    type: [TaskDto],
  })
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The task has been successfully retrieved.',
    type: TaskDto,
  })
  @ApiNotFoundResponse({
    description: 'The task with the specified ID was not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The task has been successfully updated.',
    type: TaskDto,
  })
  @ApiBadRequestResponse({ description: 'The payload is invalid.' })
  @ApiNotFoundResponse({ description: "Couldn't find the task" })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.taskService.update(id, updateTaskDto);
    await this.clearCache(id);
    return task;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The task has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: "Couldn't find the task" })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const task = await this.taskService.remove(id);
    await this.clearCache();
    return task;
  }

  /**
   * CacheInterceptor uses the request URL as the cache key,
   * so we delete the URLs whose response just became stale.
   */
  private async clearCache(id?: number) {
    const keys = ['/task'];
    if (id !== undefined) {
      keys.push(`/task/${id}`);
    }
    await this.cacheManager.mdel(keys);
  }
}
