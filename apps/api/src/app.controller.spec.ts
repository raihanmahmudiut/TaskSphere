import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DRIZZLE_PROVIDER } from './core/constants/db.constants';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockExecuteFn = jest.fn();

  const mockDb = {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        execute: mockExecuteFn,
      }),
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockExecuteFn.mockResolvedValue([]);
    mockDb.select.mockClear();
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        execute: mockExecuteFn,
      }),
    });

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DRIZZLE_PROVIDER,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = moduleRef.get<AppService>(AppService);
    controller = moduleRef.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return a string', () => {
      jest.spyOn(service, 'getHello').mockReturnValue('Hello World!');
      expect(controller.getHello()).toBe('Hello World!');
    });
  });

  describe('getUser', () => {
    it('should return user array from db', async () => {
      const mockUsers = [{ id: '1', name: 'Alice' }];
      jest.spyOn(service, 'getUser').mockResolvedValue(mockUsers as any);

      const result = await controller.getUser();
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      jest.spyOn(service, 'getUser').mockResolvedValue([] as any);
      const result = await controller.getUser();
      expect(result).toEqual([]);
    });
  });
});
