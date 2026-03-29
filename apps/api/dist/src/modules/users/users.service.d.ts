import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as allSchema from '@app/db/index';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export type User = typeof allSchema.users.$inferSelect;
export type NewUser = typeof allSchema.users.$inferInsert;
export type DrizzleClient = NodePgDatabase<typeof allSchema>;
export declare class UsersService {
    private readonly db;
    constructor(db: DrizzleClient);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'hashedPassword'>>;
    findByEmail(email: string): Promise<User | undefined>;
    findById(userId: string): Promise<Omit<User, 'hashedPassword'> | undefined>;
    update(userId: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>>;
    delete(userId: string): Promise<void>;
    findAll(): Promise<Omit<User, 'hashedPassword'>[]>;
}
