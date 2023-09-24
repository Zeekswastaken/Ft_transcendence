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
    if (status.status == 'unauthorized')
    {
        res.send(status);
        return {
          status:status,
        }
    }
    if(status.status == 'authorized')
    {
        const decoded = await this.jwt.decoded(status.token);
        const user = await this.userservice.findByName((decoded).username);
        res.send({user:user,status:status});
    }
    return status;
  }
}
