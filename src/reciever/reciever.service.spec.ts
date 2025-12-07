import { Test, TestingModule } from '@nestjs/testing';
import { RecieverService } from './reciever.service';

describe('RecieverService', () => {
  let service: RecieverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecieverService],
    }).compile();

    service = module.get<RecieverService>(RecieverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
