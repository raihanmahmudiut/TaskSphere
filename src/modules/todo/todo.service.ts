import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CollaboratorRole } from '@app/db/schema/_enums';

@Injectable()
export class TodoService {
  private todos = [];

  create(createTodoDto: CreateTodoDto) {
    const newTodo = { id: Date.now(), ...createTodoDto };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll() {
    return this.todos;
  }

  findOne(id: number) {
    return this.todos.find(todo => todo.id === id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
      this.todos[todoIndex] = { ...this.todos[todoIndex], ...updateTodoDto };
      return this.todos[todoIndex];
    }
    return null;
  }

  remove(id: number) {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
      const removedTodo = this.todos.splice(todoIndex, 1);
      return removedTodo[0];
    }
    return null;
  }

  addCollaborator(todoId: number, userId: string, role: CollaboratorRole) {
    const todo = this.findOne(todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.collaborators = todo.collaborators || [];
    todo.collaborators.push({ userId, role });
    return todo;
  }

  assignRole(todoId: number, userId: string, role: CollaboratorRole) {
    const todo = this.findOne(todoId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    const collaborator = todo.collaborators.find(c => c.userId === userId);
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }
    collaborator.role = role;
    return todo;
  }
}