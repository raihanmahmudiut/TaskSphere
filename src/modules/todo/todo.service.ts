import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as allSchema from '@app/db/index';
import { and, eq, or, inArray } from 'drizzle-orm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CollaboratorRole } from '@app/db/schema/_enums';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NEST_DRIZZLE_OPTIONS } from '@app/core/constants/db.constants';
import { WebsocketGateway } from '../websocket/websocket.gateway';

// Assuming your provider setup exports a client of this type
export type DrizzleClient = NodePgDatabase<typeof allSchema>;

@Injectable()
export class TodoService {
  constructor(
    @Inject(NEST_DRIZZLE_OPTIONS) private readonly db: DrizzleClient,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  private getRoomName(todoId: number): string {
    return `todo-app-${todoId}`;
  }

  // --- ToDo App Methods ---

  async create(createTodoDto: CreateTodoDto, ownerId: string) {
    const newTodoApp = await this.db
      .insert(allSchema.todoApps)
      .values({ ...createTodoDto, ownerId })
      .returning();
    return newTodoApp[0];
  }

  async findAllForUser(userId: string) {
    // Find apps the user is a collaborator on
    const collaborations = await this.db.query.todoAppCollaborators.findMany({
      where: eq(allSchema.todoAppCollaborators.userId, userId),
    });

    const collaboratedAppIds = collaborations.map((c) => c.todoAppId);

    // Prepare a list of conditions for the OR query
    const whereConditions = [eq(allSchema.todoApps.ownerId, userId)];

    if (collaboratedAppIds.length > 0) {
      whereConditions.push(inArray(allSchema.todoApps.id, collaboratedAppIds));
    }

    // Find apps the user owns OR is a collaborator on
    return this.db.query.todoApps.findMany({
      where: or(...whereConditions),
      with: {
        owner: {
          columns: {
            uuid: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
      },
    });
  }

  async findOne(id: number) {
    const todoApp = await this.db.query.todoApps.findFirst({
      where: eq(allSchema.todoApps.id, id),
      with: {
        owner: {
          columns: { uuid: true, name: true, email: true },
        },
        tasks: true,
        collaborators: {
          with: {
            user: {
              columns: { uuid: true, name: true, email: true },
            },
          },
        },
      },
    });
    if (!todoApp) {
      throw new NotFoundException(`ToDo App with ID ${id} not found`);
    }
    return todoApp;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const updated = await this.db
      .update(allSchema.todoApps)
      .set(updateTodoDto)
      .where(eq(allSchema.todoApps.id, id))
      .returning();
    if (updated.length === 0)
      throw new NotFoundException(`ToDo App with ID ${id} not found`);

    const updatedApp = updated[0];
    this.websocketGateway.server
      .to(this.getRoomName(id))
      .emit('appUpdated', updatedApp);
    return updatedApp;
  }

  async remove(id: number) {
    const deleted = await this.db
      .delete(allSchema.todoApps)
      .where(eq(allSchema.todoApps.id, id))
      .returning();
    if (deleted.length === 0)
      throw new NotFoundException(`ToDo App with ID ${id} not found`);

    this.websocketGateway.server
      .to(this.getRoomName(id))
      .emit('appDeleted', { id });
    return { message: `ToDo App with ID ${id} deleted successfully.` };
  }

  // --- Collaborator Methods ---

  async addCollaborator(
    todoId: number,
    userId: string,
    role: CollaboratorRole,
  ) {
    const newCollaborator = await this.db
      .insert(allSchema.todoAppCollaborators)
      .values({ todoAppId: todoId, userId, role })
      .returning();

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('collaboratorAdded', newCollaborator[0]);
    return newCollaborator[0];
  }

  async removeCollaborator(todoId: number, userId: string) {
    await this.db
      .delete(allSchema.todoAppCollaborators)
      .where(
        and(
          eq(allSchema.todoAppCollaborators.todoAppId, todoId),
          eq(allSchema.todoAppCollaborators.userId, userId),
        ),
      );

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('collaboratorRemoved', { todoId, userId });
    return { message: 'Collaborator removed successfully.' };
  }

  async assignRole(todoId: number, userId: string, role: CollaboratorRole) {
    const updated = await this.db
      .update(allSchema.todoAppCollaborators)
      .set({ role })
      .where(
        and(
          eq(allSchema.todoAppCollaborators.todoAppId, todoId),
          eq(allSchema.todoAppCollaborators.userId, userId),
        ),
      )
      .returning();
    if (updated.length === 0)
      throw new NotFoundException('Collaborator not found on this ToDo App.');

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('collaboratorUpdated', updated[0]);
    return updated[0];
  }

  // --- Task Methods ---

  async createTask(todoId: number, createTaskDto: CreateTaskDto) {
    const newTask = await this.db
      .insert(allSchema.tasks)
      .values({ ...createTaskDto, todoAppId: todoId })
      .returning();
    const createdTask = newTask[0];

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('taskCreated', createdTask);
    return createdTask;
  }

  async findTasksForApp(todoId: number) {
    return this.db.query.tasks.findMany({
      where: eq(allSchema.tasks.todoAppId, todoId),
    });
  }

  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto) {
    const updated = await this.db
      .update(allSchema.tasks)
      .set(updateTaskDto)
      .where(eq(allSchema.tasks.id, taskId))
      .returning();
    if (updated.length === 0)
      throw new NotFoundException(`Task with ID ${taskId} not found`);

    const updatedTask = updated[0];
    this.websocketGateway.server
      .to(this.getRoomName(updatedTask.todoAppId))
      .emit('taskUpdated', updatedTask);
    return updatedTask;
  }

  async removeTask(taskId: number) {
    const deleted = await this.db
      .delete(allSchema.tasks)
      .where(eq(allSchema.tasks.id, taskId))
      .returning();
    if (deleted.length === 0)
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    const deletedTask = deleted[0];

    this.websocketGateway.server
      .to(this.getRoomName(deletedTask.todoAppId))
      .emit('taskDeleted', {
        id: deletedTask.id,
        todoAppId: deletedTask.todoAppId,
      });
    return { message: `Task with ID ${taskId} deleted successfully.` };
  }
}
