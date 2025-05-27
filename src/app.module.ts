import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  AllExceptionsFilter,
  ValidationExceptionFilter,
  BadRequestExceptionFilter,
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
  NotFoundExceptionFilter,
} from './core/filters';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestDrizzleModule } from './modules/drizzle/drizzle.module';
import * as schema from '../src/db/index';
import { AuthModule } from './modules/auth/auth.module';
import { WebsocketGateway } from './modules/websocket/websocket.gateway';
import { TodoModule } from './modules/todo/todo.module';
import { WebsocketModule } from './modules/websocket/websocket.module'; // Import WebsocketModule
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local', // Specify your .env file
    }),
    NestDrizzleModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigService available to useFactory
      inject: [ConfigService], // Inject ConfigService into useFactory
      useFactory: (configService: ConfigService) => {
        // Type the injected service
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return {
          driver: 'postgres-js', // This matches your DrizzleService implementation
          url: databaseUrl,
          options: { schema: schema }, // Pass the combined schema object
          // migrationOptions: { migrationsFolder: './drizzle' }, // Path to migrations for DrizzleService.migrate()
        };
      },
    }),
    UsersModule,
    AuthModule,
    WebsocketGateway,
    TodoModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
  ],
})
export class AppModule {}
