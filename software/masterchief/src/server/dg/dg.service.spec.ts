import { Test, TestingModule } from '@nestjs/testing';
import { DgService } from './dg.service';

describe('DgService', () => {
  let service: DgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DgService],
    }).compile();

    service = module.get<DgService>(DgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
