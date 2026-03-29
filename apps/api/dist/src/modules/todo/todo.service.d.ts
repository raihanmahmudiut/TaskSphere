import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as allSchema from '@app/db/index';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CollaboratorRole } from '@tasksphere/shared';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export type DrizzleClient = NodePgDatabase<typeof allSchema>;
export declare class TodoService {
    private readonly db;
    private readonly websocketGateway;
    constructor(db: DrizzleClient, websocketGateway: WebsocketGateway);
    private getRoomName;
    create(createTodoDto: CreateTodoDto, ownerId: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findAllForUser(userId: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        tasks: never;
        owner: never;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        tasks: never;
        owner: never;
        collaborators: never;
    }>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    addCollaborator(todoId: number, userId: string, role: CollaboratorRole): Promise<{
        todoAppId: number;
        userId: string;
        role: "VIEWER" | "EDITOR";
        assignedAt: Date;
    }>;
    removeCollaborator(todoId: number, userId: string): Promise<{
        message: string;
    }>;
    assignRole(todoId: number, userId: string, role: CollaboratorRole): Promise<{
        todoAppId: number;
        userId: string;
        role: "VIEWER" | "EDITOR";
        assignedAt: Date;
    }>;
    createTask(todoId: number, createTaskDto: CreateTaskDto): Promise<{
        id: number;
        title: string;
        description: string;
        status: "TODO" | "IN_PROGRESS" | "DONE";
        priority: "LOW" | "MEDIUM" | "HIGH";
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
        todoAppId: number;
    }>;
    findTasksForApp(todoId: number): Promise<{
        id: number;
        title: string;
        description: string;
        status: "TODO" | "IN_PROGRESS" | "DONE";
        priority: "LOW" | "MEDIUM" | "HIGH";
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
        todoAppId: number;
    }[]>;
    updateTask(taskId: number, updateTaskDto: UpdateTaskDto): Promise<{
        id: number;
        title: string;
        description: string;
        status: "TODO" | "IN_PROGRESS" | "DONE";
        priority: "LOW" | "MEDIUM" | "HIGH";
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
        todoAppId: number;
    }>;
    removeTask(taskId: number): Promise<{
        message: string;
    }>;
}
