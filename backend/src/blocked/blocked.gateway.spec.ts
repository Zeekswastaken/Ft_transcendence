import { Test, TestingModule } from '@nestjs/testing';
import { BlockedGateway } from './blocked.gateway';
import { BlockedService } from './blocked.service';

describe('BlockedGateway', () => {
  let gateway: BlockedGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedGateway, BlockedService],
    }).compile();

    gateway = module.get<BlockedGateway>(BlockedGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
