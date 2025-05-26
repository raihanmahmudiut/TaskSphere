import { Controller, Get, Post, Body, Param, Delete, Patch, InternalServerErrorException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CollaboratorRole } from '@app/db/schema/_enums';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'The todo has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'Return all todos.' })
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiResponse({ status: 200, description: 'Return a todo.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.todoService.findOne(+id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    try {
      return this.todoService.update(+id, updateTodoDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.todoService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiOperation({ summary: 'Add a collaborator to a todo' })
  @ApiResponse({ status: 200, description: 'Collaborator added successfully.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @Post(':id/collaborators')
  addCollaborator(@Param('id') id: string, @Body() body: { userId: string, role: CollaboratorRole }) {
    return this.todoService.addCollaborator(+id, body.userId, body.role);
  }

  @ApiOperation({ summary: 'Assign a role to a collaborator' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully.' })
  @ApiResponse({ status: 404, description: 'Todo or collaborator not found.' })
  @Patch(':id/collaborators/:userId')
  assignRole(@Param('id') id: string, @Param('userId') userId: string, @Body() body: { role: CollaboratorRole }) {
    return this.todoService.assignRole(+id, userId, body.role);
  }
}