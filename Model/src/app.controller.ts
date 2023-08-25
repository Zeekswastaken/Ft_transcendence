import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response ,Request} from 'express';
import { TokenGuard } from './auth/guards';
import { UserService } from './user/user.service';
import { UserDto } from './Dto/use.Dto';
import { JWToken } from './auth/jwt.service';


@Controller()
export class AppController {
  constructor(private readonly userservice:UserService,private readonly jwt:JWToken){}
  @Post()
  @UseGuards(TokenGuard)
  async default(@Res() res:Response,@Req() req:Request,@Query() query: UserDto){
    const status = (req as any).user;
    console.log(status.message);
    if (status.status == 'unauthorized')
    {
      //res.redirect('10.14.4.8:3000/login')
        res.send(status);
        return {
          status:status,
        }
    }
        //res.sendFile('/Users/orbiay/Desktop/App2/app/views/index.html');
    if(status.status == 'authorized')
    {
        console.log(query.avatar_url);
        //return req.body;
        const decoded = await this.jwt.decoded(status.token);
        const user = await this.userservice.findByName((decoded).username);
        //user.username = JSON.stringify(user.username);
        //res.render('profile',{user});
        res.send({user:user,status:status});
    }
    console.log("status = " + status);
    return status;
  }
}
