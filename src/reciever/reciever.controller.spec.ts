import { Test, TestingModule } from '@nestjs/testing';
import { RecieverController } from './reciever.controller';

describe('RecieverController', () => {
  let controller: RecieverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecieverController],
    }).compile();

    controller = module.get<RecieverController>(RecieverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
