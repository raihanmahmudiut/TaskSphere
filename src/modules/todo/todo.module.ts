import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { NestDrizzleModule } from '../drizzle/drizzle.module';
import { TodoController } from './todo.controller';

@Module({
  imports: [WebsocketModule, NestDrizzleModule],
  providers: [TodoService],
  controllers: [TodoController],
  exports: [TodoService],
})
export class TodoModule {}
