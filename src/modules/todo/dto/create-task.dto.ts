import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '@app/db/schema/_enums';
import { taskPriorityEnum, taskStatusEnum } from '@app/db';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Integrate Drizzle ORM',
    description: 'The title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    example: 'Refactor services to use Drizzle for DB queries.',
    description: 'A detailed description of the task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO',
    description: 'The current status of the task',
  })
  @IsEnum(taskStatusEnum.enumValues)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    description: 'The priority of the task',
  })
  @IsEnum(taskPriorityEnum.enumValues)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    required: false,
    example: '2025-12-31',
    description: 'The due date for the task',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
