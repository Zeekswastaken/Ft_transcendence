import { Module } from '@nestjs/common';
import { BlockedService } from './blocked.service';
import { BlockedGateway } from './blocked.gateway';
import { User } from 'src/database/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFriends } from 'src/database/userFriends.entity';
import { Channel } from 'src/database/channel.entity';
import { JwtModule } from '@nestjs/jwt';
import { BlockedUser } from 'src/database/blockedUser.entity';
import { UserService } from 'src/user/user.service';
import { Stats } from 'src/database/stats.entity';
import { FriendsService } from 'src/friends/friends.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/database/notifications.entity';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelMembership } from 'src/database/channelMembership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFriends, BlockedUser, Channel, Stats, Notification, ChannelMembership]),JwtModule.register({
    secret:process.env.JWT_SECRET, 
    signOptions: { expiresIn: '1h' }, 
  })],
  providers: [BlockedGateway, BlockedService,UserService, NotificationsService, FriendsService, ChannelService],
  exports: [TypeOrmModule]
})
export class BlockedModule {}
