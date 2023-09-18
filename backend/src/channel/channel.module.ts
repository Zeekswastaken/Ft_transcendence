import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../database/channel.entity';
import { ChannelMembership } from '../database/channelMembership.entity';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { User } from '../database/user.entity'
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Stats } from 'src/database/stats.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelMembership, User, Stats]),JwtModule.register({
    secret:"0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", 
    signOptions: { expiresIn: '1h' }, 
  })],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [ChannelGateway, ChannelService, UserService],
})

export class ChannelModule {}

