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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const drizzle_orm_1 = require("drizzle-orm");
const db_constants_1 = require("../../core/constants/db.constants");
const allSchema = require("../../db/index");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
    }
    async create(createUserDto) {
        const { email, password, name } = createUserDto;
        const existingUser = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(allSchema.users.email, email.toLowerCase()),
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        try {
            const newUserPayload = {
                email: email.toLowerCase(),
                hashedPassword,
                name: name || null,
            };
            const insertedUsers = await this.db
                .insert(allSchema.users)
                .values(newUserPayload)
                .returning({
                uuid: allSchema.users.uuid,
                email: allSchema.users.email,
                name: allSchema.users.name,
                createdAt: allSchema.users.createdAt,
                updatedAt: allSchema.users.updatedAt,
            });
            if (!insertedUsers || insertedUsers.length === 0) {
                throw new common_1.InternalServerErrorException('Could not create user');
            }
            return insertedUsers[0];
        }
        catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException('Could not create user due to an unexpected error.');
        }
    }
    async findByEmail(email) {
        return this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(allSchema.users.email, email.toLowerCase()),
        });
    }
    async findById(userId) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(allSchema.users.uuid, userId),
            columns: {
                hashedPassword: false,
            },
        });
        return user;
    }
    async update(userId, updateUserDto) {
        const existingUser = await this.findById(userId);
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = {};
        if (updateUserDto.name !== undefined) {
            updateData.name = updateUserDto.name;
        }
        if (updateUserDto.password !== undefined) {
            const saltOrRounds = 10;
            updateData.hashedPassword = await bcrypt.hash(updateUserDto.password, saltOrRounds);
        }
        if (Object.keys(updateData).length === 0) {
            return existingUser;
        }
        try {
            const updatedUsers = await this.db
                .update(allSchema.users)
                .set({ ...updateData, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(allSchema.users.uuid, userId))
                .returning({
                uuid: allSchema.users.uuid,
                email: allSchema.users.email,
                name: allSchema.users.name,
                createdAt: allSchema.users.createdAt,
                updatedAt: allSchema.users.updatedAt,
            });
            if (!updatedUsers || updatedUsers.length === 0) {
                throw new common_1.InternalServerErrorException('Could not update user');
            }
            return updatedUsers[0];
        }
        catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Could not update user due to an unexpected error.');
        }
    }
    async delete(userId) {
        const existingUser = await this.findById(userId);
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        try {
            await this.db
                .delete(allSchema.users)
                .where((0, drizzle_orm_1.eq)(allSchema.users.uuid, userId));
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new common_1.InternalServerErrorException('Could not delete user due to an unexpected error.');
        }
    }
    async findAll() {
        return this.db.query.users.findMany({
            columns: {
                hashedPassword: false,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_constants_1.DRIZZLE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map