import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import {
  connectionFactory,
  createNestDrizzleProviders,
} from './drizzle.provider';
import {
  NestDrizzleAsyncOptions,
  NestDrizzleOptions,
  NestDrizzleOptionsFactory,
} from './interfaces/drizzle.interfaces';
import { NEST_DRIZZLE_OPTIONS } from '@app/core/constants/db.constants';

@Global()
@Module({})
export class NestDrizzleModule {
  public static forRoot(options: NestDrizzleOptions): DynamicModule {
    const providers = [
      ...createNestDrizzleProviders(options),
      DrizzleService,
      connectionFactory,
    ];
    return {
      module: NestDrizzleModule,
      providers: providers,
      exports: [connectionFactory, DrizzleService],
    };
  }

  public static forRootAsync(options: NestDrizzleAsyncOptions): DynamicModule {
    const optionProvider = this.createOptionsProvider(options);
    const providers = [optionProvider, DrizzleService, connectionFactory];

    if (options.useClass && !options.useExisting && !options.useFactory) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return {
      module: NestDrizzleModule,
      imports: options.imports || [],
      providers: providers,
      exports: [connectionFactory, DrizzleService],
    };
  }

  private static createOptionsProvider(
    options: NestDrizzleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_DRIZZLE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: NEST_DRIZZLE_OPTIONS,
      useFactory: async (optionsFactory: NestDrizzleOptionsFactory) =>
        await optionsFactory.createNestDrizzleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
