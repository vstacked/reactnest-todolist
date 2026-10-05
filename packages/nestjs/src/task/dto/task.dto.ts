import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength } from 'class-validator';

export class TaskDto {
  @ApiProperty({ description: 'The unique identifier of the task', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The title of the task',
    minLength: 3,
    maxLength: 30,
    example: 'Sample Task',
  })
  @IsString()
  @Length(3, 30)
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    minLength: 0,
    maxLength: 200,
    example: 'This is a sample task description',
  })
  @IsString()
  @MaxLength(200)
  description: string;
}
