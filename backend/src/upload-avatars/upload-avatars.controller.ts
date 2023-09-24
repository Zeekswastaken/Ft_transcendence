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
import { checkPasswordStrength } from 'src/utils/passwordChecker';

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
        // console.log(req.files);
        const user  = await this.userservice.findById(id);
        return {message:"SUCCESS",user};
    }
  @Put('update')
  @UseInterceptors(FileInterceptor('file',{storage: diskStorage({
    destination: '../frontend/public/avatars/', // Specify the destination folder where files will be stored
    filename: (req, file, callback) => {
      // console.log("dir : ",__dirname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const newFileName = `avatar-${uniqueSuffix}${fileExtension}`;
      callback(null, newFileName);},}),}))
  
    async uploadFile(@UploadedFile() file: Express.Multer.File,@Body() Body,@Res() res) {
        if (Body.id)
        {
          // if(file)
          // console.log("Fileeeeeeeeeeeeeeeeeeeeee = ",Body.file);
        // const decode = await this.jwttoken.decoded(Body.cookie);
        var user = await this.userservice.findById(Body.id);
        if (Body.username && Body.username != user.username)
        {
          let lastone = await this.userservice.findByName(Body.username);
          if (lastone )
          res.send({message:'exists'});
        }
        // user.ismanuel = true; 
        // user.gender = Body.gender as String;
        // delete Body.cookie;
        // const usersec = await this.userservice.findById(id); 
        if (user){
            if (Body.password && checkPasswordStrength(Body.password) == 'Weak')
                res.send({message:'weak'})
            if (Body.password)
                Body.password = await this.userservice.hashpassword(Body.password);
            if ( !Body.password )
                Body.password = user.password;
            if(!Body.username)
                Body.username = user.username;
            if (!Body.avatar_url)
                Body.avatar_url = user.avatar_url;
            if (!Body.Bio)
                Body.Bio = user.Bio;
            if (Body.pr === null)
                delete Body.privacy;
            if(Body.towfa == 'true')
              Body.twofactorenabled = true;
            if (Body.towfa == 'false')
              Body.twofactorenabled = false;
            delete Body.towfa;
        // console.log("TWPFA == ",Body.twofactorenabled);
        // console.log("Bodyyyyyyyy",Body);
        Body.ischange = true;
        // user.birthDay = Body.birthDay as Date;
        if (file){
          user.avatar_url = '/avatars/' +file.filename as String;
          Body.avatar_url =  '/avatars/' +file.filename;
        }
        // console.log("->>>>>>>>>>>>>>>>>>>>>>>>>",file.path);
        if (!file)
          delete Body.file;
        if (Body.pr == 'public')
            Body.privacy = true;
        else if (Body.pr == 'private')
          Body.privacy = false;
        delete Body.pr;
        await this.userservice.update(Body,user.id as number);
        const after = await this.userservice.findById(user.id);
        // console.log("Body == ",Body);
        // console.log("file  ==",file);
        // console.log("user after == ", after);
      
        // const fs = this.uploadAvatarsService.readFile(after.avatar_url as string);
        // console.log(fs);
        res.send({message:'success',token:await this.jwttoken.generateToken_2(after)});
      }
      else
        res.send('invalid Token');
    }
    else
      res.send('invalid id');
  }
}
