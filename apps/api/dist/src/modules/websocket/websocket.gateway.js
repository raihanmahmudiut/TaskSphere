"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
let WebsocketGateway = class WebsocketGateway {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger('WebsocketGateway');
        this.jwtSecret =
            this.configService.get('JWT_SECRET') || 'default-secret';
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            this.logger.warn(`Client ${client.id} attempted to connect without token`);
            client.emit('error', { message: 'Authentication required' });
            client.disconnect();
            return;
        }
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            client.data.user = decoded;
            this.logger.log(`Client ${client.id} connected and authenticated as ${decoded.email}`);
        }
        catch (error) {
            this.logger.warn(`Client ${client.id} attempted to connect with invalid token`);
            client.emit('error', { message: 'Invalid token' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(client, room) {
        if (!client.data.user) {
            client.emit('error', { message: 'Authentication required' });
            return;
        }
        client.join(room);
        this.logger.log(`Client ${client.id} (user: ${client.data.user.email}) joined room: ${room}`);
        client.emit('joinedRoom', room);
    }
    handleLeaveRoom(client, room) {
        if (!client.data.user) {
            client.emit('error', { message: 'Authentication required' });
            return;
        }
        client.leave(room);
        this.logger.log(`Client ${client.id} left room: ${room}`);
        client.emit('leftRoom', room);
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLeaveRoom", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-production-domain.com']
                : ['http://localhost:3000', 'http://localhost:4000'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map