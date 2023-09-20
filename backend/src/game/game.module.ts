import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { JWToken } from 'src/auth/jwt.service';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { Message } from 'src/database/message.entity';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { GameService } from './game.service';
import { Stats } from 'src/database/stats.entity';
import { Match } from 'src/database/match.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/database/notifications.entity';
import { UserFriends } from 'src/database/userFriends.entity';
import { GameInvite } from 'src/database/gameInvite.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Match,Stats,Notification,UserFriends,GameInvite]),UserModule],
    controllers:[],
    providers:[UserService,GameGateway,JWToken,JwtService, GameService,UserService, NotificationsService]
})
export class GameModule {}