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
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const allSchema = require("../../db/index");
const drizzle_orm_1 = require("drizzle-orm");
const db_constants_1 = require("../../core/constants/db.constants");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let TodoService = class TodoService {
    constructor(db, websocketGateway) {
        this.db = db;
        this.websocketGateway = websocketGateway;
    }
    getRoomName(todoId) {
        return `todo-app-${todoId}`;
    }
    async create(createTodoDto, ownerId) {
        const newTodoApp = await this.db
            .insert(allSchema.todoApps)
            .values({ ...createTodoDto, ownerId })
            .returning();
        return newTodoApp[0];
    }
    async findAllForUser(userId) {
        const collaborations = await this.db.query.todoAppCollaborators.findMany({
            where: (0, drizzle_orm_1.eq)(allSchema.todoAppCollaborators.userId, userId),
        });
        const collaboratedAppIds = collaborations.map((c) => c.todoAppId);
        const whereConditions = [(0, drizzle_orm_1.eq)(allSchema.todoApps.ownerId, userId)];
        if (collaboratedAppIds.length > 0) {
            whereConditions.push((0, drizzle_orm_1.inArray)(allSchema.todoApps.id, collaboratedAppIds));
        }
        return this.db.query.todoApps.findMany({
            where: (0, drizzle_orm_1.or)(...whereConditions),
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
    async findOne(id) {
        const todoApp = await this.db.query.todoApps.findFirst({
            where: (0, drizzle_orm_1.eq)(allSchema.todoApps.id, id),
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
            throw new common_1.NotFoundException(`ToDo App with ID ${id} not found`);
        }
        return todoApp;
    }
    async update(id, updateTodoDto) {
        const updated = await this.db
            .update(allSchema.todoApps)
            .set(updateTodoDto)
            .where((0, drizzle_orm_1.eq)(allSchema.todoApps.id, id))
            .returning();
        if (updated.length === 0)
            throw new common_1.NotFoundException(`ToDo App with ID ${id} not found`);
        const updatedApp = updated[0];
        this.websocketGateway.server
            .to(this.getRoomName(id))
            .emit('appUpdated', updatedApp);
        return updatedApp;
    }
    async remove(id) {
        const deleted = await this.db
            .delete(allSchema.todoApps)
            .where((0, drizzle_orm_1.eq)(allSchema.todoApps.id, id))
            .returning();
        if (deleted.length === 0)
            throw new common_1.NotFoundException(`ToDo App with ID ${id} not found`);
        this.websocketGateway.server
            .to(this.getRoomName(id))
            .emit('appDeleted', { id });
        return { message: `ToDo App with ID ${id} deleted successfully.` };
    }
    async addCollaborator(todoId, userId, role) {
        const newCollaborator = await this.db
            .insert(allSchema.todoAppCollaborators)
            .values({ todoAppId: todoId, userId, role })
            .returning();
        this.websocketGateway.server
            .to(this.getRoomName(todoId))
            .emit('collaboratorAdded', newCollaborator[0]);
        return newCollaborator[0];
    }
    async removeCollaborator(todoId, userId) {
        await this.db
            .delete(allSchema.todoAppCollaborators)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(allSchema.todoAppCollaborators.todoAppId, todoId), (0, drizzle_orm_1.eq)(allSchema.todoAppCollaborators.userId, userId)));
        this.websocketGateway.server
            .to(this.getRoomName(todoId))
            .emit('collaboratorRemoved', { todoId, userId });
        return { message: 'Collaborator removed successfully.' };
    }
    async assignRole(todoId, userId, role) {
        const updated = await this.db
            .update(allSchema.todoAppCollaborators)
            .set({ role })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(allSchema.todoAppCollaborators.todoAppId, todoId), (0, drizzle_orm_1.eq)(allSchema.todoAppCollaborators.userId, userId)))
            .returning();
        if (updated.length === 0)
            throw new common_1.NotFoundException('Collaborator not found on this ToDo App.');
        this.websocketGateway.server
            .to(this.getRoomName(todoId))
            .emit('collaboratorUpdated', updated[0]);
        return updated[0];
    }
    async createTask(todoId, createTaskDto) {
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
    async findTasksForApp(todoId) {
        return this.db.query.tasks.findMany({
            where: (0, drizzle_orm_1.eq)(allSchema.tasks.todoAppId, todoId),
        });
    }
    async updateTask(taskId, updateTaskDto) {
        const updated = await this.db
            .update(allSchema.tasks)
            .set(updateTaskDto)
            .where((0, drizzle_orm_1.eq)(allSchema.tasks.id, taskId))
            .returning();
        if (updated.length === 0)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        const updatedTask = updated[0];
        this.websocketGateway.server
            .to(this.getRoomName(updatedTask.todoAppId))
            .emit('taskUpdated', updatedTask);
        return updatedTask;
    }
    async removeTask(taskId) {
        const deleted = await this.db
            .delete(allSchema.tasks)
            .where((0, drizzle_orm_1.eq)(allSchema.tasks.id, taskId))
            .returning();
        if (deleted.length === 0)
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        const deletedTask = deleted[0];
        this.websocketGateway.server
            .to(this.getRoomName(deletedTask.todoAppId))
            .emit('taskDeleted', {
            id: deletedTask.id,
            todoAppId: deletedTask.todoAppId,
        });
        return { message: `Task with ID ${taskId} deleted successfully.` };
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_constants_1.NEST_DRIZZLE_OPTIONS)),
    __metadata("design:paramtypes", [Object, websocket_gateway_1.WebsocketGateway])
], TodoService);
//# sourceMappingURL=todo.service.js.map