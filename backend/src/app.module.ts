import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './database/message.entity';
import { TokenGuard } from './auth/guards';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWToken } from './auth/jwt.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Channel} from './database/channel.entity';
import { ChannelMembership} from './database/channelMembership.entity';
import { User} from './database/user.entity';
import { ChannelModule } from './channel/channel.module';
import { ChannelService } from './channel/channel.service';
import { Stats } from './database/stats.entity';
import { Match } from './database/match.entity';
import { GameInvite } from './database/gameInvite.entity';
import { BlockedUser } from './database/blockedUser.entity';
import { UserFriends } from './database/userFriends.entity';
import { Achievements } from './database/achievements.entity';
import { WebsocketGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameModule } from './game/game.module';
import typeorm from './config/typeorm';
import { BlockedModule } from './blocked/blocked.module';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
// import { FileUploadModule } from './file-upload/file-upload.module';
import { UploadAvatarsController } from './upload-avatars/upload-avatars.controller';
import { UploadAvatarsModule } from './upload-avatars/upload-avatars.module';
import { UploadAvatarsService } from './upload-avatars/upload-avatars.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
    UserModule, AuthModule,ChannelModule,JwtModule.register({
      secret:process.env.JWT_SECRET, 
      signOptions: { expiresIn: '24h' },
    }), ChatModule,ProfileModule, GameModule, BlockedModule, NotificationsModule, UploadAvatarsModule
  ],
  controllers: [AppController, UserController, UploadAvatarsController ],
  providers: [AppService,TokenGuard,JWToken,UserService,ChannelService, NotificationsService,UploadAvatarsService],
})
export class AppModule {}

