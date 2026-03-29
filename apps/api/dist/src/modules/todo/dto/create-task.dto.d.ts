import { TaskStatus, TaskPriority } from '@tasksphere/shared';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
}
