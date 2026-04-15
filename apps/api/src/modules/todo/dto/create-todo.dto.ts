import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The name of the ToDo app',
    example: 'Project Phoenix',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
