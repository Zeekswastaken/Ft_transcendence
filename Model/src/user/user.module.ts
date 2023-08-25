import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Stats } from 'src/database/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Stats])],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

