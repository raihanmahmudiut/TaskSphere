import { DynamicModule } from '@nestjs/common';
import { NestDrizzleAsyncOptions, NestDrizzleOptions } from './interfaces/drizzle.interfaces';
export declare class NestDrizzleModule {
    static forRoot(options: NestDrizzleOptions): DynamicModule;
    static forRootAsync(options: NestDrizzleAsyncOptions): DynamicModule;
    private static createOptionsProvider;
}
