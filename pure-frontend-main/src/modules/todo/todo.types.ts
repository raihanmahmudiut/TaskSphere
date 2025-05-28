export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    collaborators: Collaborator[];
}

export interface Collaborator {
    userId: string;
    role: CollaboratorRole;
}

export type CollaboratorRole = 'VIEWER' | 'EDITOR';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errorMessage?: string;
}