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
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/database/match.entity';
import { GameInvite } from 'src/database/gameInvite.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Match, GameInvite]),UserModule,AuthModule, FriendsModule, BlockedModule, GameModule],
  controllers: [ProfileController],
  providers: [ProfileService,UserService,JWToken,JwtService, FriendsService, BlockedService, NotificationsService, ChannelService, GameService]
})
export class ProfileModule {}
