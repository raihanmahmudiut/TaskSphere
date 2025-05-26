import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ description: 'Title of the todo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the todo', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Due date of the todo', type: Date, required: false })
  @IsDate()
  @IsOptional()
  dueDate?: Date;
}