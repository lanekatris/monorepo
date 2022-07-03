import { Test, TestingModule } from '@nestjs/testing';
import { ClimbController } from './climb.controller';

describe('ClimbController', () => {
  let controller: ClimbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClimbController],
    }).compile();

    controller = module.get<ClimbController>(ClimbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
