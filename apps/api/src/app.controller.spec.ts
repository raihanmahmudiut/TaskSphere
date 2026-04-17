import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    service = moduleRef.get<AppService>(AppService);
    controller = moduleRef.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });

    it('should delegate to AppService', () => {
      jest.spyOn(service, 'getHello').mockReturnValue('Custom response');
      expect(controller.getHello()).toBe('Custom response');
    });
  });
});
