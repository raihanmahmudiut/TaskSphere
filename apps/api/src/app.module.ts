import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filters';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestDrizzleModule } from './modules/drizzle/drizzle.module';
import * as schema from '../src/db/index';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    NestDrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return {
          driver: 'postgres-js',
          url: databaseUrl,
          options: { schema: schema },
          // migrationOptions: { migrationsFolder: './drizzle' }, // Path to migrations for DrizzleService.migrate()
        };
      },
    }),
    UsersModule,
    AuthModule,
    TodoModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
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
