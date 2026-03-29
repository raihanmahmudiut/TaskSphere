import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    server: Server;
    private logger;
    private jwtSecret;
    constructor(configService: ConfigService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, room: string): void;
    handleLeaveRoom(client: Socket, room: string): void;
}
