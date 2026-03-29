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
exports.TodoAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const index_1 = require("../../../db/index");
const role_decorator_1 = require("./role.decorator");
const db_constants_1 = require("../../../core/constants/db.constants");
let TodoAuthGuard = class TodoAuthGuard {
    constructor(reflector, db) {
        this.reflector = reflector;
        this.db = db;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(role_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const todoId = parseInt(request.params.id || request.params.todoId, 10);
        if (!user || !todoId) {
            return false;
        }
        const todoApp = await this.db.query.todoApps.findFirst({
            where: (0, drizzle_orm_1.eq)(index_1.todoApps.id, todoId),
            with: {
                collaborators: true,
            },
        });
        if (!todoApp) {
            throw new common_1.NotFoundException('ToDo App not found');
        }
        if (todoApp.ownerId === user.uuid) {
            return true;
        }
        const collaboration = todoApp.collaborators?.find((c) => c.userId === user.uuid);
        if (requiredRoles.includes('OWNER') && todoApp.ownerId === user.uuid) {
            return true;
        }
        if (collaboration) {
            for (const role of requiredRoles) {
                if (role === 'EDITOR' && collaboration.role === 'EDITOR') {
                    return true;
                }
                if (role === 'VIEWER' &&
                    (collaboration.role === 'VIEWER' || collaboration.role === 'EDITOR')) {
                    return true;
                }
            }
        }
        throw new common_1.ForbiddenException('You do not have the necessary permissions for this resource.');
    }
};
exports.TodoAuthGuard = TodoAuthGuard;
exports.TodoAuthGuard = TodoAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_2.Inject)(db_constants_1.DRIZZLE_PROVIDER)),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], TodoAuthGuard);
//# sourceMappingURL=todo-auth.guard.js.map