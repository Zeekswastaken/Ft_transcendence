import { Module } from '@nestjs/common';
import { UploadAvatarsService } from './upload-avatars.service';
import { UploadAvatarsController } from './upload-avatars.controller';
import { multerConfig } from './multer-config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(multerConfig), // Import multer configuration
  ],
  controllers: [UploadAvatarsController],
  providers:[]
})
export class UploadAvatarsModule {}
