import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedGateway } from './blocked.gateway';
import { User } from 'src/database/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriends } from 'src/database/userFriends.entity';
import { Channel } from 'src/database/channel.entity';
import { JwtModule } from '@nestjs/jwt';
import { BlockedUser } from 'src/database/blockedUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFriends, BlockedUser, Channel]),JwtModule.register({
    secret:"0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", 
    signOptions: { expiresIn: '1h' }, 
  })],
  providers: [BlockedGateway, BlockedService],
})
export class BlockedModule {}
