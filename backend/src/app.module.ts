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
import typeorm from './config/typeorm';


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
      secret:"0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", 
      signOptions: { expiresIn: '1h' },
    }), ChatModule,ProfileModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService,TokenGuard,JWToken,UserService,ChannelService],
})
export class AppModule {}

