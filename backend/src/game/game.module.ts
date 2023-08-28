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

@Module({
    imports:[TypeOrmModule.forFeature([Channel,Message,ChannelMembership]),UserModule],
    controllers:[],
    providers:[UserService,GameGateway,JWToken,JwtService]
})
export class GameModule {}
