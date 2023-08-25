import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JWToken } from 'src/auth/jwt.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[UserModule,AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService,UserService,JWToken,JwtService]
})
export class ProfileModule {}
