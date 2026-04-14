import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as allSchema from '@tasksphere/db';
import { and, eq, or, inArray, ilike, asc, desc, SQL } from 'drizzle-orm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CollaboratorRole } from '@tasksphere/db';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';
import { WebsocketGateway } from '../websocket/websocket.gateway';

export type DrizzleClient = NodePgDatabase<typeof allSchema>;

export interface TaskFilterParams {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class TodoService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  private getRoomName(todoId: number): string {
    return `todo-app-${todoId}`;
  }

  private async logActivity(
    todoAppId: number,
    userId: string,
    action: string,
    entityType?: string,
    entityId?: string,
    metadata?: Record<string, any>,
  ) {
    const [activity] = await this.db
      .insert(allSchema.activities)
      .values({
        todoAppId,
        userId,
        action,
        entityType: entityType || null,
        entityId: entityId ? String(entityId) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      })
      .returning();

    const activityWithUser = await this.db.query.activities.findFirst({
      where: eq(allSchema.activities.id, activity.id),
      with: {
        user: { columns: { uuid: true, name: true, email: true } },
      },
    });

    this.websocketGateway.server
      .to(this.getRoomName(todoAppId))
      .emit('activityCreated', activityWithUser);

    return activity;
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
    const collaborations = await this.db.query.todoAppCollaborators.findMany({
      where: eq(allSchema.todoAppCollaborators.userId, userId),
    });

    const collaboratedAppIds = collaborations.map((c) => c.todoAppId);
    const whereConditions = [eq(allSchema.todoApps.ownerId, userId)];

    if (collaboratedAppIds.length > 0) {
      whereConditions.push(inArray(allSchema.todoApps.id, collaboratedAppIds));
    }

    return this.db.query.todoApps.findMany({
      where: or(...whereConditions),
      with: {
        owner: { columns: { uuid: true, name: true, email: true } },
        tasks: true,
        collaborators: {
          with: {
            user: { columns: { uuid: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const todoApp = await this.db.query.todoApps.findFirst({
      where: eq(allSchema.todoApps.id, id),
      with: {
        owner: { columns: { uuid: true, name: true, email: true } },
        tasks: true,
        collaborators: {
          with: {
            user: { columns: { uuid: true, name: true, email: true } },
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
    actorId?: string,
  ) {
    const newCollaborator = await this.db
      .insert(allSchema.todoAppCollaborators)
      .values({ todoAppId: todoId, userId, role })
      .returning();

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('collaboratorAdded', newCollaborator[0]);

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'collaborator.added',
        'collaborator',
        userId,
        { role },
      );
    }
    return newCollaborator[0];
  }

  async removeCollaborator(todoId: number, userId: string, actorId?: string) {
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

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'collaborator.removed',
        'collaborator',
        userId,
      );
    }
    return { message: 'Collaborator removed successfully.' };
  }

  async assignRole(
    todoId: number,
    userId: string,
    role: CollaboratorRole,
    actorId?: string,
  ) {
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

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'collaborator.role_changed',
        'collaborator',
        userId,
        { role },
      );
    }
    return updated[0];
  }

  // --- Task Methods ---

  async createTask(
    todoId: number,
    createTaskDto: CreateTaskDto,
    actorId?: string,
  ) {
    const maxPositionResult = await this.db
      .select({ maxPos: allSchema.tasks.position })
      .from(allSchema.tasks)
      .where(eq(allSchema.tasks.todoAppId, todoId))
      .orderBy(desc(allSchema.tasks.position))
      .limit(1);

    const nextPosition =
      maxPositionResult.length > 0 ? maxPositionResult[0].maxPos + 1 : 0;

    const newTask = await this.db
      .insert(allSchema.tasks)
      .values({ ...createTaskDto, todoAppId: todoId, position: nextPosition })
      .returning();
    const createdTask = newTask[0];

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('taskCreated', createdTask);

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'task.created',
        'task',
        String(createdTask.id),
        { title: createdTask.title },
      );
    }
    return createdTask;
  }

  async findTasksForApp(todoId: number, filters?: TaskFilterParams) {
    const conditions: SQL[] = [eq(allSchema.tasks.todoAppId, todoId)];

    if (filters?.status) {
      const statuses = filters.status.split(',') as allSchema.TaskStatus[];
      conditions.push(inArray(allSchema.tasks.status, statuses));
    }

    if (filters?.priority) {
      const priorities = filters.priority.split(
        ',',
      ) as allSchema.TaskPriority[];
      conditions.push(inArray(allSchema.tasks.priority, priorities));
    }

    if (filters?.search) {
      conditions.push(ilike(allSchema.tasks.title, `%${filters.search}%`));
    }

    const sortColumn = (() => {
      switch (filters?.sortBy) {
        case 'dueDate':
          return allSchema.tasks.dueDate;
        case 'priority':
          return allSchema.tasks.priority;
        case 'createdAt':
          return allSchema.tasks.createdAt;
        case 'title':
          return allSchema.tasks.title;
        default:
          return allSchema.tasks.position;
      }
    })();

    const sortDir =
      filters?.sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);

    return this.db
      .select()
      .from(allSchema.tasks)
      .where(and(...conditions))
      .orderBy(sortDir, asc(allSchema.tasks.createdAt));
  }

  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
    actorId?: string,
  ) {
    const existing = await this.db.query.tasks.findFirst({
      where: eq(allSchema.tasks.id, taskId),
    });

    const updated = await this.db
      .update(allSchema.tasks)
      .set({ ...updateTaskDto, updatedAt: new Date() })
      .where(eq(allSchema.tasks.id, taskId))
      .returning();
    if (updated.length === 0)
      throw new NotFoundException(`Task with ID ${taskId} not found`);

    const updatedTask = updated[0];
    this.websocketGateway.server
      .to(this.getRoomName(updatedTask.todoAppId))
      .emit('taskUpdated', updatedTask);

    if (actorId && existing) {
      if (updateTaskDto.status === 'DONE' && existing.status !== 'DONE') {
        await this.logActivity(
          updatedTask.todoAppId,
          actorId,
          'task.completed',
          'task',
          String(taskId),
          { title: updatedTask.title },
        );
      } else {
        await this.logActivity(
          updatedTask.todoAppId,
          actorId,
          'task.updated',
          'task',
          String(taskId),
          { title: updatedTask.title },
        );
      }
    }
    return updatedTask;
  }

  async removeTask(taskId: number, actorId?: string) {
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

    if (actorId) {
      await this.logActivity(
        deletedTask.todoAppId,
        actorId,
        'task.deleted',
        'task',
        String(taskId),
        { title: deletedTask.title },
      );
    }
    return { message: `Task with ID ${taskId} deleted successfully.` };
  }

  async reorderTasks(
    todoId: number,
    taskPositions: { id: number; position: number }[],
  ) {
    for (const tp of taskPositions) {
      await this.db
        .update(allSchema.tasks)
        .set({ position: tp.position, updatedAt: new Date() })
        .where(
          and(
            eq(allSchema.tasks.id, tp.id),
            eq(allSchema.tasks.todoAppId, todoId),
          ),
        );
    }

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('tasksReordered', { todoId });
  }

  // --- Dependency Methods ---

  async getDependencies(todoId: number) {
    return this.db
      .select()
      .from(allSchema.taskDependencies)
      .where(eq(allSchema.taskDependencies.todoAppId, todoId));
  }

  async createDependency(
    todoId: number,
    sourceTaskId: number,
    targetTaskId: number,
    actorId?: string,
  ) {
    if (sourceTaskId === targetTaskId) {
      throw new BadRequestException('A task cannot depend on itself.');
    }

    const hasCycle = await this.detectCycle(todoId, sourceTaskId, targetTaskId);
    if (hasCycle) {
      throw new BadRequestException(
        'Adding this dependency would create a cycle.',
      );
    }

    const [dep] = await this.db
      .insert(allSchema.taskDependencies)
      .values({ sourceTaskId, targetTaskId, todoAppId: todoId })
      .returning();

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('dependencyCreated', dep);

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'dependency.created',
        'dependency',
        String(dep.id),
        { sourceTaskId, targetTaskId },
      );
    }
    return dep;
  }

  async removeDependency(todoId: number, depId: number, actorId?: string) {
    const deleted = await this.db
      .delete(allSchema.taskDependencies)
      .where(
        and(
          eq(allSchema.taskDependencies.id, depId),
          eq(allSchema.taskDependencies.todoAppId, todoId),
        ),
      )
      .returning();

    if (deleted.length === 0) {
      throw new NotFoundException(`Dependency with ID ${depId} not found`);
    }

    this.websocketGateway.server
      .to(this.getRoomName(todoId))
      .emit('dependencyDeleted', { id: depId, todoAppId: todoId });

    if (actorId) {
      await this.logActivity(
        todoId,
        actorId,
        'dependency.deleted',
        'dependency',
        String(depId),
      );
    }
    return { message: 'Dependency removed successfully.' };
  }

  private async detectCycle(
    todoId: number,
    sourceTaskId: number,
    targetTaskId: number,
  ): Promise<boolean> {
    const allDeps = await this.db
      .select()
      .from(allSchema.taskDependencies)
      .where(eq(allSchema.taskDependencies.todoAppId, todoId));

    const adjacency = new Map<number, number[]>();
    for (const dep of allDeps) {
      const list = adjacency.get(dep.sourceTaskId) || [];
      list.push(dep.targetTaskId);
      adjacency.set(dep.sourceTaskId, list);
    }

    // Add the proposed edge
    const existing = adjacency.get(sourceTaskId) || [];
    existing.push(targetTaskId);
    adjacency.set(sourceTaskId, existing);

    // BFS from targetTaskId: if we can reach sourceTaskId, there's a cycle
    const visited = new Set<number>();
    const queue = [targetTaskId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === sourceTaskId) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      const neighbors = adjacency.get(current) || [];
      queue.push(...neighbors);
    }
    return false;
  }

  // --- Activity Methods ---

  async getActivities(todoId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const items = await this.db.query.activities.findMany({
      where: eq(allSchema.activities.todoAppId, todoId),
      with: {
        user: { columns: { uuid: true, name: true, email: true } },
      },
      orderBy: [desc(allSchema.activities.createdAt)],
      limit,
      offset,
    });
    return { items, page, limit };
  }
}
