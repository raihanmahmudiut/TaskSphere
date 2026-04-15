import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CollaboratorRole } from '@tasksphere/db';
import { JwtAuthGuard } from '@app/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Roles } from './guards/role.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { TodoAuthGuard } from './guards/todo-auth.guard';

@ApiBearerAuth()
@ApiTags('todo')
@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // --- ToDo App Endpoints ---

  @Post()
  @ApiOperation({ summary: 'Create a new todo app' })
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const user = req.user as any;
    return this.todoService.create(createTodoDto, user.uuid);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todo apps for the current user' })
  findAllForUser(@Req() req: Request) {
    const user = req.user as any;
    return this.todoService.findAllForUser(user.uuid);
  }

  @Get(':id')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Get a todo app by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR')
  @ApiOperation({ summary: 'Update a todo app' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER')
  @ApiOperation({ summary: 'Delete a todo app' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }

  // --- Collaborator Endpoints ---

  @Post(':id/collaborators')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER')
  @ApiOperation({ summary: 'Add a collaborator to a todo app (Owner only)' })
  addCollaborator(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: string; role: CollaboratorRole },
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.addCollaborator(
      id,
      body.userId,
      body.role,
      user.uuid,
    );
  }

  @Patch(':id/collaborators/:userId')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Assign/update a role for a collaborator (Owner only)',
  })
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
    @Body() body: { role: CollaboratorRole },
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.assignRole(id, userId, body.role, user.uuid);
  }

  @Delete(':id/collaborators/:userId')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER')
  @ApiOperation({
    summary: 'Remove a collaborator from a todo app (Owner only)',
  })
  removeCollaborator(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.removeCollaborator(id, userId, user.uuid);
  }

  // --- Task Endpoints ---

  @Post(':todoId/tasks')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR')
  @ApiOperation({ summary: 'Create a new task within a todo app' })
  createTask(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.createTask(todoId, createTaskDto, user.uuid);
  }

  @Get(':todoId/tasks')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Get all tasks for a specific todo app' })
  getTasksForApp(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.todoService.findTasksForApp(todoId, {
      status,
      priority,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Patch(':todoId/tasks/reorder')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR')
  @ApiOperation({ summary: 'Reorder tasks within a todo app' })
  reorderTasks(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() reorderDto: ReorderTasksDto,
  ) {
    return this.todoService.reorderTasks(todoId, reorderDto.tasks);
  }

  @Patch(':todoId/tasks/:taskId')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR')
  @ApiOperation({ summary: 'Update a task' })
  updateTask(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.updateTask(taskId, updateTaskDto, user.uuid);
  }

  @Delete(':todoId/tasks/:taskId')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR')
  @ApiOperation({ summary: 'Delete a task' })
  removeTask(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.todoService.removeTask(taskId, user.uuid);
  }

  // --- Activity Endpoints ---

  @Get(':todoId/activities')
  @UseGuards(TodoAuthGuard)
  @Roles('OWNER', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Get activity log for a todo app' })
  getActivities(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.todoService.getActivities(
      todoId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
