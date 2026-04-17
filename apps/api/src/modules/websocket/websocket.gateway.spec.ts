import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';
import { ConfigService } from '@nestjs/config';

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGateway,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should disconnect client without token', () => {
      const mockClient = {
        id: 'test-client',
        handshake: { auth: {}, headers: {} },
        emit: jest.fn(),
        disconnect: jest.fn(),
        data: {},
      } as any;

      gateway.handleConnection(mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: 'Authentication required',
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should disconnect client with invalid token', () => {
      const mockClient = {
        id: 'test-client',
        handshake: { auth: { token: 'invalid-token' }, headers: {} },
        emit: jest.fn(),
        disconnect: jest.fn(),
        data: {},
      } as any;

      gateway.handleConnection(mockClient);

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: 'Invalid token',
      });
      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleJoinRoom', () => {
    it('should reject unauthenticated client', () => {
      const mockClient = {
        data: {},
        emit: jest.fn(),
        join: jest.fn(),
      } as any;

      gateway.handleJoinRoom(mockClient, 'test-room');

      expect(mockClient.emit).toHaveBeenCalledWith('error', {
        message: 'Authentication required',
      });
      expect(mockClient.join).not.toHaveBeenCalled();
    });

    it('should allow authenticated client to join room', () => {
      const mockClient = {
        id: 'client-1',
        data: { user: { email: 'test@test.com', sub: 'uuid-1' } },
        emit: jest.fn(),
        join: jest.fn(),
      } as any;

      gateway.handleJoinRoom(mockClient, 'todo-app-1');

      expect(mockClient.join).toHaveBeenCalledWith('todo-app-1');
      expect(mockClient.emit).toHaveBeenCalledWith('joinedRoom', 'todo-app-1');
    });
  });
});
