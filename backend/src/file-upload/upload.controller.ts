import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer-config';
import { Injectable } from '@nestjs/common';
@Injectable()
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file.buffer);
    // Handle the uploaded file here, for example, save it to a database or process it further.
    return { filename: file.filename, originalName: file.originalname };
  }
}