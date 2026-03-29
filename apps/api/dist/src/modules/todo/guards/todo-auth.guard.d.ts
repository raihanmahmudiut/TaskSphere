import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { schema } from '@app/db/index';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
export type DrizzleClient = NodePgDatabase<typeof schema>;
export declare class TodoAuthGuard implements CanActivate {
    private reflector;
    private readonly db;
    constructor(reflector: Reflector, db: DrizzleClient);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
