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
import { ChannelController } from './channel.controller';
// import { UploadController } from '../file-upload/upload.controller';
// import { FileUploadModule } from '../file-upload/file-upload.module';


@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelMembership, User, Stats]),JwtModule.register({
    secret:process.env.JWT_SECRET, 
    signOptions: { expiresIn: '1h' }, 
  }), ],
  exports: [TypeOrmModule],
  controllers: [ChannelController, ],
  providers: [ChannelGateway, ChannelService, UserService],
})

export class ChannelModule {}

