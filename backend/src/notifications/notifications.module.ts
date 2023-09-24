import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { UserFriends } from 'src/database/userFriends.entity';
import { Channel } from 'src/database/channel.entity';
import { JwtModule } from '@nestjs/jwt';
import { Notification } from 'src/database/notifications.entity';
import { NotificationsService } from './notifications.service';
@Module({
    imports: [TypeOrmModule.forFeature([User, UserFriends, Notification]),JwtModule.register({
        secret:process.env.JWT_SECRET, 
        signOptions: { expiresIn: '1h' }, 
      })],
      providers: [NotificationsService],
      exports: [TypeOrmModule]
})
export class NotificationsModule {}
