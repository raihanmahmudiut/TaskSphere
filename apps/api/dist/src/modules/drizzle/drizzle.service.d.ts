import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { NestDrizzleOptions } from './interfaces/drizzle.interfaces';
interface IDrizzleService {
    migrate(): Promise<void>;
    getDrizzle(): Promise<PostgresJsDatabase>;
}
export declare class DrizzleService implements IDrizzleService {
    private _NestDrizzleOptions;
    private _drizzle;
    constructor(_NestDrizzleOptions: NestDrizzleOptions);
    private logger;
    migrate(): Promise<void>;
    getDrizzle(): Promise<PostgresJsDatabase<Record<string, unknown>>>;
}
export {};
