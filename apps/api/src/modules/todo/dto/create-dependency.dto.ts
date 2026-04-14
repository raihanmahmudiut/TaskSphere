import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateDependencyDto {
  @ApiProperty({ description: 'The prerequisite task ID' })
  @IsInt()
  sourceTaskId: number;

  @ApiProperty({ description: 'The dependent task ID' })
  @IsInt()
  targetTaskId: number;
}
