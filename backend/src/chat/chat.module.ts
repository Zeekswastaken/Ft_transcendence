import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { WebsocketGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/database/channel.entity';
import { Message } from 'src/database/message.entity';
import { JWToken } from 'src/auth/jwt.service';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ChannelService } from 'src/channel/channel.service';
import { BlockedService } from 'src/blocked/blocked.service';
import { BlockedUser } from 'src/database/blockedUser.entity';
import { UserFriends } from 'src/database/userFriends.entity';


@Module({
    imports:[TypeOrmModule.forFeature([Channel,Message,ChannelMembership,BlockedUser,UserFriends]),UserModule],
    controllers:[],
    providers:[ChatService,WebsocketGateway,ChatService,JWToken,JwtService, UserService,ChannelService, BlockedService]
})
export class ChatModule {

}
