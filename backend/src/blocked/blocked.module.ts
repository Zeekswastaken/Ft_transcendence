import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedGateway } from './blocked.gateway';

@Module({
  providers: [BlockedGateway, BlockedService],
})
export class BlockedModule {}
