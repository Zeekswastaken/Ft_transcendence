import { Module } from '@nestjs/common';
import { UploadAvatarsService } from './upload-avatars.service';
import { UploadAvatarsController } from './upload-avatars.controller';
import { multerConfig } from './multer-config';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JWToken } from 'src/auth/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MulterModule.register(multerConfig),UserModule // Import multer configuration
  ],
  controllers: [UploadAvatarsController],
  providers:[UploadAvatarsService,UserService,JWToken,JwtService]
})
export class UploadAvatarsModule {}
