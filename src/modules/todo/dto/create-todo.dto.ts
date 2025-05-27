import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The name of the ToDo app',
    example: 'Project Phoenix',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional description for the ToDo app',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'An optional due date for the ToDo app',
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  dueDate?: Date;
}
