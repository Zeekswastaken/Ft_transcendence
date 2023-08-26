import { Test, TestingModule } from '@nestjs/testing';
import { FriendsGateway } from './friends.gateway';
import { FriendsService } from './friends.service';

describe('FriendsGateway', () => {
  let gateway: FriendsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsGateway, FriendsService],
    }).compile();

    gateway = module.get<FriendsGateway>(FriendsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  });
});
