import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import schema from '../src/db/index';
export declare class AppService {
    private conn;
    constructor(conn: PostgresJsDatabase<typeof schema>);
    getHello(): string;
    getUser(): Promise<{
        name: string;
        uuid: string;
        email: string;
        hashedPassword: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
