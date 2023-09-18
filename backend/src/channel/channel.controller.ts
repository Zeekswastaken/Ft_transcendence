import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file-upload/multer-config';
import { UploadController } from 'src/file-upload/upload.controller';
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService, private readonly uploadController: UploadController){}
    @Post('createChannel')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    async create(@Body() data :{ userid:Number, name:String, type:String, password: String}, @Res() res) {
        try{ 
          // console.log("it kinda worked");
          // const token = client.handshake.query.token;
          // const decodedToken = this.jwtService.verify(token.toString());
          // const userid = decodedToken.sub;
          // const avatar = await this.uploadController.uploadFile(file)
          // const { filename, originalName } = avatar;
          const channel = await this.channelService.createChannel(data, data.userid);
          // console.log("=====> ", channel);
        if (channel)
          res.status(HttpStatus.CREATED).json(channel);
        else
            res.status(HttpStatus.FORBIDDEN).json('Error');
        } catch (error)
        {
          console.error('Error creating channel: ', error.message);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
        }
      }
}
