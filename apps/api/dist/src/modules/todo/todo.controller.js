"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const todo_service_1 = require("./todo.service");
const create_todo_dto_1 = require("./dto/create-todo.dto");
const update_todo_dto_1 = require("./dto/update-todo.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_decorator_1 = require("./guards/role.decorator");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const todo_auth_guard_1 = require("./guards/todo-auth.guard");
let TodoController = class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    create(createTodoDto, req) {
        const user = req.user;
        return this.todoService.create(createTodoDto, user.uuid);
    }
    findAllForUser(req) {
        const user = req.user;
        return this.todoService.findAllForUser(user.uuid);
    }
    findOne(id) {
        return this.todoService.findOne(id);
    }
    update(id, updateTodoDto) {
        return this.todoService.update(id, updateTodoDto);
    }
    remove(id) {
        return this.todoService.remove(id);
    }
    addCollaborator(id, body) {
        return this.todoService.addCollaborator(id, body.userId, body.role);
    }
    assignRole(id, userId, body) {
        return this.todoService.assignRole(id, userId, body.role);
    }
    removeCollaborator(id, userId) {
        return this.todoService.removeCollaborator(id, userId);
    }
    createTask(todoId, createTaskDto) {
        return this.todoService.createTask(todoId, createTaskDto);
    }
    getTasksForApp(todoId) {
        return this.todoService.findTasksForApp(todoId);
    }
    updateTask(todoId, taskId, updateTaskDto) {
        return this.todoService.updateTask(taskId, updateTaskDto);
    }
    removeTask(todoId, taskId) {
        return this.todoService.removeTask(taskId);
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new todo app' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_dto_1.CreateTodoDto, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all todo apps for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "findAllForUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR', 'VIEWER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a todo app by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a todo app' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_todo_dto_1.UpdateTodoDto]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a todo app' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/collaborators'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a collaborator to a todo app (Owner only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "addCollaborator", null);
__decorate([
    (0, common_1.Patch)(':id/collaborators/:userId'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign/update a role for a collaborator (Owner only)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Delete)(':id/collaborators/:userId'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a collaborator from a todo app (Owner only)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "removeCollaborator", null);
__decorate([
    (0, common_1.Post)(':todoId/tasks'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task within a todo app' }),
    __param(0, (0, common_1.Param)('todoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)(':todoId/tasks'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR', 'VIEWER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks for a specific todo app' }),
    __param(0, (0, common_1.Param)('todoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "getTasksForApp", null);
__decorate([
    (0, common_1.Patch)(':todoId/tasks/:taskId'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task' }),
    __param(0, (0, common_1.Param)('todoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('taskId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)(':todoId/tasks/:taskId'),
    (0, common_1.UseGuards)(todo_auth_guard_1.TodoAuthGuard),
    (0, role_decorator_1.Roles)('OWNER', 'EDITOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    __param(0, (0, common_1.Param)('todoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('taskId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TodoController.prototype, "removeTask", null);
exports.TodoController = TodoController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('todo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('todo'),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoController);
//# sourceMappingURL=todo.controller.js.map