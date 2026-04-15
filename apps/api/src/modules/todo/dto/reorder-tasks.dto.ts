import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class TaskPosition {
  @IsInt()
  id: number;

  @IsInt()
  position: number;
}

export class ReorderTasksDto {
  @ApiProperty({ type: [TaskPosition] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskPosition)
  tasks: TaskPosition[];
}
