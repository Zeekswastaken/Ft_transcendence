import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { WebsocketGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/database/channel.entity';
import { Message } from 'src/database/message.entity';
import { JWToken } from 'src/auth/jwt.service';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { JwtService } from '@nestjs/jwt';


@Module({
    imports:[TypeOrmModule.forFeature([Channel,Message,ChannelMembership])],
    controllers:[],
    providers:[ChatService,WebsocketGateway,ChatService,JWToken,JwtService]
})
export class ChatModule {

}
