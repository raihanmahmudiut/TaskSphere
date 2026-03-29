import { DrizzleService } from './drizzle.service';
export declare const connectionFactory: {
    provide: string;
    useFactory: (drizzleServiceInstance: DrizzleService) => Promise<import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, unknown>>>;
    inject: (typeof DrizzleService)[];
};
export declare function createNestDrizzleProviders(options: any): {
    provide: string;
    useValue: any;
}[];
