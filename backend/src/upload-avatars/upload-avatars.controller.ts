// upload.controller.ts

import { Controller, Get, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer-config';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadAvatarsController {
    // @Get()
    // async render(@Res() res: Response) {
    //    res.sendFile('/nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/index.html');
    // }
    // @Get('image')
    // @UseInterceptors(FileInterceptor('file'))
    // async UpdateProfile(@UploadedFile() file, @Req() req)
    // {
    //     // await this.SettingService.updatePhoto(file, req.user);
    //     console.log(req.files);
    //     return {message:"SUCCESS"};
    // }
@Post('image')
//   @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file',{storage: diskStorage({
    destination: './uploads', // Specify the destination folder where files will be stored
    filename: (req, file, callback) => {
      console.log("dir : ",__dirname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const newFileName = `avatar-${uniqueSuffix}${fileExtension}`;
      callback(null, newFileName);},}),}))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file.filename);
      }
  }
