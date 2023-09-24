import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { UserFriends } from 'src/database/userFriends.entity';
import { Channel } from 'src/database/channel.entity';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from 'src/database/notifications.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { UserService } from 'src/user/user.service';
import { Stats } from 'src/database/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFriends, Channel, ChannelMembership, Notification, Stats]),JwtModule.register({
    secret:process.env.JWT_SECRET, 
    signOptions: { expiresIn: '1h' }, 
  })],
  providers: [FriendsGateway, FriendsService, NotificationsService, ChannelService, UserService],
  exports: [TypeOrmModule]
})
export class FriendsModule {}
