import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JWToken } from 'src/auth/jwt.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsService } from 'src/friends/friends.service';
import { BlockedService } from 'src/blocked/blocked.service';
import { BlockedModule } from 'src/blocked/blocked.module';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  imports:[UserModule,AuthModule, FriendsModule, BlockedModule],
  controllers: [ProfileController],
  providers: [ProfileService,UserService,JWToken,JwtService, FriendsService, BlockedService, NotificationsService, ChannelService]
})
export class ProfileModule {}
