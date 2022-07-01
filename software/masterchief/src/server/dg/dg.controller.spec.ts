import { Test, TestingModule } from '@nestjs/testing';
import { DgController } from './dg.controller';

describe('DgController', () => {
  let controller: DgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DgController],
    }).compile();

    controller = module.get<DgController>(DgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
