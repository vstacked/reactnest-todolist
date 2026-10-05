import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty({ description: 'The unique identifier of the task', default: 1 })
  id: number;

  @ApiProperty({
    description: 'The title of the task',
    minLength: 3,
    maxLength: 30,
    default: 'Sample Task',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    minLength: 0,
    maxLength: 200,
    default: 'This is a sample task description',
  })
  description: string;
}
