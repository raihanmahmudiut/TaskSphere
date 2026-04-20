import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockEmit = jest.fn();
const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

const mockGateway = {
  server: { to: mockTo },
};

function createMockDb() {
  return {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
    query: {
      todoApps: { findFirst: jest.fn(), findMany: jest.fn() },
      todoAppCollaborators: { findMany: jest.fn() },
      tasks: { findFirst: jest.fn() },
      activities: { findFirst: jest.fn() },
    },
  };
}

describe('TodoService', () => {
  let service: TodoService;
  let mockDb: ReturnType<typeof createMockDb>;

  beforeEach(async () => {
    mockDb = createMockDb();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: DRIZZLE_PROVIDER, useValue: mockDb },
        { provide: WebsocketGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  describe('create', () => {
    it('should create a todo app and return it', async () => {
      const created = { id: 1, name: 'Test App', ownerId: 'user-1' };
      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([created]),
        }),
      });

      const result = await service.create({ name: 'Test App' }, 'user-1');
      expect(result).toEqual(created);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a todo app when found', async () => {
      const app = { id: 1, name: 'Test', ownerId: 'user-1' };
      mockDb.query.todoApps.findFirst.mockResolvedValue(app);

      const result = await service.findOne(1);
      expect(result).toEqual(app);
    });

    it('should throw NotFoundException when not found', async () => {
      mockDb.query.todoApps.findFirst.mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a todo app and emit event', async () => {
      mockDb.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1 }]),
        }),
      });

      const result = await service.remove(1);
      expect(result.message).toContain('deleted successfully');
      expect(mockTo).toHaveBeenCalledWith('todo-app-1');
      expect(mockEmit).toHaveBeenCalledWith('appDeleted', { id: 1 });
    });

    it('should throw NotFoundException when app not found', async () => {
      mockDb.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should create a task with auto-incremented position', async () => {
      const task = {
        id: 10,
        title: 'New task',
        todoAppId: 1,
        status: 'TODO',
        position: 0,
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([task]),
        }),
      });

      mockDb.query.activities.findFirst.mockResolvedValue({
        id: 1,
        user: { uuid: 'u1', name: 'User', email: 'u@e.com' },
      });

      const result = await service.createTask(
        1,
        { title: 'New task', status: 'TODO' as any, priority: 'MEDIUM' as any },
        'actor-1',
      );
      expect(result).toEqual(task);
      expect(mockEmit).toHaveBeenCalledWith('taskCreated', task);
    });
  });

  describe('removeTask', () => {
    it('should delete task and emit event', async () => {
      const deleted = { id: 5, title: 'Deleted', todoAppId: 1 };
      let deleteCallCount = 0;
      mockDb.delete.mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockImplementation(() => {
            deleteCallCount++;
            return Promise.resolve(deleteCallCount === 1 ? [deleted] : []);
          }),
        }),
      }));

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest
            .fn()
            .mockResolvedValue([{ id: 99, todoAppId: 1, userId: 'actor-1' }]),
        }),
      });

      mockDb.query.activities.findFirst.mockResolvedValue({
        id: 99,
        user: { uuid: 'actor-1', name: 'User', email: 'u@e.com' },
      });

      const result = await service.removeTask(5, 'actor-1');
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException when task not found', async () => {
      mockDb.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.removeTask(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTask - dependency enforcement', () => {
    it('should block marking DONE when prerequisites are not done', async () => {
      mockDb.query.tasks.findFirst.mockResolvedValue({
        id: 10,
        status: 'TODO',
        todoAppId: 1,
      });

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { id: 1, sourceTaskId: 5, targetTaskId: 10, todoAppId: 1 },
          ]),
        }),
      });

      await expect(
        service.updateTask(10, { status: 'DONE' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow marking DONE when all prerequisites are done', async () => {
      mockDb.query.tasks.findFirst.mockResolvedValue({
        id: 10,
        status: 'TODO',
        todoAppId: 1,
      });

      let selectCallCount = 0;
      mockDb.select.mockImplementation(() => ({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockImplementation(() => {
            selectCallCount++;
            if (selectCallCount === 1) {
              return Promise.resolve([
                { id: 1, sourceTaskId: 5, targetTaskId: 10, todoAppId: 1 },
              ]);
            }
            return Promise.resolve([
              { id: 5, status: 'DONE', title: 'Prereq' },
            ]);
          }),
        }),
      }));

      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([
              { id: 10, status: 'DONE', todoAppId: 1, title: 'Task' },
            ]),
          }),
        }),
      });

      const result = await service.updateTask(10, { status: 'DONE' } as any);
      expect(result.status).toBe('DONE');
    });
  });

  describe('createDependency - cycle detection', () => {
    it('should reject self-dependency', async () => {
      await expect(
        service.createDependency(1, 5, 5),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject circular dependency', async () => {
      // A->B exists, trying to add B->A
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            { id: 1, sourceTaskId: 10, targetTaskId: 20, todoAppId: 1 },
          ]),
        }),
      });

      await expect(
        service.createDependency(1, 20, 10),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
