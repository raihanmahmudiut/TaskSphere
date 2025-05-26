import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsDateString } from 'class-validator';
import { taskStatusEnum, taskPriorityEnum, TaskStatus, TaskPriority } from '@app/db/schema/_enums';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Status of the task', enum: taskStatusEnum, required: false })
  @IsEnum(taskStatusEnum)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: 'Priority of the task', enum: taskPriorityEnum, required: false })
  @IsEnum(taskPriorityEnum)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: 'Due date of the task', type: Date, required: false })
  @IsDate()
  @IsOptional()
  dueDate?: Date;
}