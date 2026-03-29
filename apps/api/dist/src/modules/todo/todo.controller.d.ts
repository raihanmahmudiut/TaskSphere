import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CollaboratorRole } from '@tasksphere/shared';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto, req: Request): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findAllForUser(req: Request): Promise<{
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
    addCollaborator(id: number, body: {
        userId: string;
        role: CollaboratorRole;
    }): Promise<{
        todoAppId: number;
        userId: string;
        role: "VIEWER" | "EDITOR";
        assignedAt: Date;
    }>;
    assignRole(id: number, userId: string, body: {
        role: CollaboratorRole;
    }): Promise<{
        todoAppId: number;
        userId: string;
        role: "VIEWER" | "EDITOR";
        assignedAt: Date;
    }>;
    removeCollaborator(id: number, userId: string): Promise<{
        message: string;
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
    getTasksForApp(todoId: number): Promise<{
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
    updateTask(todoId: number, taskId: number, updateTaskDto: UpdateTaskDto): Promise<{
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
    removeTask(todoId: number, taskId: number): Promise<{
        message: string;
    }>;
}
