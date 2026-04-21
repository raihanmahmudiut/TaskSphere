import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : [
        'http://localhost:3000',
        'http://localhost:4000',
        'http://localhost:5173',
      ],
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebsocketGateway');
  private jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
  }

  handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      this.logger.warn(
        `Client ${client.id} attempted to connect without token`,
      );
      client.emit('error', { message: 'Authentication required' });
      client.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        sub: string;
        email: string;
      };
      client.data.user = decoded;
      this.logger.log(
        `Client ${client.id} connected and authenticated as ${decoded.email}`,
      );
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} attempted to connect with invalid token`,
      );
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    if (!client.data.user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    client.join(room);
    this.logger.log(
      `Client ${client.id} (user: ${client.data.user.email}) joined room: ${room}`,
    );
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    if (!client.data.user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('joinTodoApp')
  handleJoinTodoApp(client: Socket, todoAppId: number): void {
    if (!client.data.user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    const room = `todo-app-${todoAppId}`;
    client.join(room);
    this.logger.log(
      `Client ${client.id} (user: ${client.data.user.email}) joined todo-app room: ${room}`,
    );
    client.emit('joinedTodoApp', room);
  }

  @SubscribeMessage('leaveTodoApp')
  handleLeaveTodoApp(client: Socket, todoAppId: number): void {
    if (!client.data.user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    const room = `todo-app-${todoAppId}`;
    client.leave(room);
    this.logger.log(
      `Client ${client.id} left todo-app room: ${room}`,
    );
    client.emit('leftTodoApp', room);
  }
}
