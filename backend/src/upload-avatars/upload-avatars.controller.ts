// upload.controller.ts

import { Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer-config';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';
import { JWToken } from 'src/auth/jwt.service';
import { UploadAvatarsService } from './upload-avatars.service';

@Controller('upload')
export class UploadAvatarsController {
    constructor(private readonly userservice:UserService,private readonly jwttoken:JWToken,private readonly uploadAvatarsService:UploadAvatarsService){}
    // @Get()
    // async render(@Res() res: Response) {
    //    res.sendFile('/nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/index.html');
    // }
    @Get('image/:id')
    async UpdateProfile(@Param('id') id:number,@Req() req)
    {
      // const user = await this.userservice.findById(id);
      // const avatar = "./backend/uploads/" + ob
        // await this.SettingService.updatePhoto(file, req.user);
        console.log(req.files);
        const user  = await this.userservice.findById(id);
        return {message:"SUCCESS",user};
    }
@Post('image')
  @UseInterceptors(FileInterceptor('file',{storage: diskStorage({
    destination: '../frontend/public/avatars/', // Specify the destination folder where files will be stored
    filename: (req, file, callback) => {
      console.log("dir : ",__dirname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const newFileName = `avatar-${uniqueSuffix}${fileExtension}`;
      callback(null, newFileName);},}),}))
  
    async uploadFile(@UploadedFile() file: Express.Multer.File,@Body() Body) {
        const decode = await this.jwttoken.decoded(Body.cookie);
        var user = await this.userservice.findById(decode.id);
        user.ismanuel = true;
        user.gender = Body.gender as String;
        delete Body.cookie;
        // user.birthDay = Body.birthDay as Date;
        user.avatar_url = '/avatars/' +file.filename as String;
        console.log("->>>>>>>>>>>>>>>>>>>>>>>>>",file.path);
        await this.userservice.update(user,user.id as number);
        const after = await this.userservice.findById(Body.id);
        console.log("Body == ",Body);
        console.log("file  ==",file);
        console.log("user after == ", after);
      
        // const fs = this.uploadAvatarsService.readFile(after.avatar_url as string);
        // console.log(fs);
        return await this.jwttoken.generateToken_2(after);
      }
  }
