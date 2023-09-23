import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file-upload/multer-config';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import { UploadController } from 'src/file-upload/upload.controller';
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService){}
    @Post('createChannel')
    @UseInterceptors(FileInterceptor('file',{storage: diskStorage({
      destination: '../frontend/public/avatars/', // Specify the destination folder where files will be stored
      filename: (req, file, callback) => {
        console.log("dir : ",__dirname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        const newFileName = `avatar-${uniqueSuffix}${fileExtension}`;
        callback(null, newFileName);},}),}))
    
    async create(@UploadedFile() file: Express.Multer.File,@Body() data, @Res() res) {
        try{ 
          // console.log("it kinda worked");
          // const token = client.handshake.query.token;
          // const decodedToken = this.jwtService.verify(token.toString());
          // const userid = decodedToken.sub;
          // const avatar = await this.uploadController.uploadFile(file)
          // const { filename, originalName } = avatar;
          const channel = await this.channelService.createChannel(data, data.userid, file);
          
          // console.log("=====> ", channel);
        if (typeof channel == 'object')
        {
          console.log("IT DID WORK")
          res.status(HttpStatus.CREATED).json(channel);
        }
        else
        res.send({
          message: channel,
       });
        } catch (error)
        {
          console.error('Error creating channel: ', error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
        }
      }
}
