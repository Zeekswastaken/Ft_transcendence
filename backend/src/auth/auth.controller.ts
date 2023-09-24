import { UserService } from './../user/user.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards,Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, MoreInfos, TO_update, jwtDTO, UserDto2 } from 'src/Dto/use.Dto';
import { LocalStrategy } from './local.startegy';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenGuard } from './guards';
import { error } from 'console';
import { JWToken } from './jwt.service';
import { BSON } from 'typeorm';
import { User } from 'src/database/user.entity';
import { JwtService } from '@nestjs/jwt';



@Controller('auth')
export class AuthController {
    constructor(private readonly authservice:AuthService,private readonly localStrategy:LocalStrategy,private readonly userservice:UserService,private readonly jwtservice:JWToken){}

    @Put('modify-data')
    async modyfiy(@Body() Body,@Res() res){
        const decode = await this.jwtservice.decoded(Body.cookie);
        delete Body.cookie;
        delete Body.avatar_url;
        const id = decode.id as number;
        await this.userservice.update(Body,id);
        const user = await this.userservice.findById(id);
        if (user)
        {
            const cookie_token = await this.authservice.generateToken_2(user);
            res.send(cookie_token)
        }
        else
            res.send('Error');
    }

    @Post('signup')
    async create(@Body() Body:UserDto,@Res() res){

        const ret = await this.authservice.check_and_create(Body);
        if(typeof ret == 'object')
        {
            const cookie_token = await this.authservice.generateToken_2(ret as User);
            res.send(cookie_token);
        }
        else
             res.send({
                message: ret,
             })
    }

    @Post('login')
    async checking(@Body() Body:UserDto,@Res() res){

        if (!Body.username)
            res.send({message:'empty'});
        const user1 = await this.localStrategy.validate(Body.username,Body.password);
        const user = await this.userservice.findByName(Body.username);
        if (!user1)
            res.send({message:'notExists'});
        else 
        {
            const cookie_token = await this.authservice.generateToken_2(user);
            const user2 = await this.jwtservice.decoded(cookie_token);
            res.send({message:'success',token:cookie_token,user:user2});
        }
    }
    @Get('Sign-Out')
    async log_out(@Body() Body,@Res() res){
        res.clearCookie('accessToken');
        res.status(200)
    }
}

@Controller('auth')
export class googleController{
    constructor(private readonly authservice:AuthService,private readonly userservice:UserService){}
    @UseGuards(AuthGuard('google'))
    @Get('google')
    googlelogin(){
    }

    @UseGuards(AuthGuard('google'))
    @Get('from-google')
    async googleloginredirect(@Req() req, @Res() res){
        const user = await req.user;
        const newUser = await this.authservice.create_Oauth(user);
        if (typeof newUser == 'object')
        {
            const cookie_token = await this.authservice.generateToken_2(newUser);

            res.cookie('accessToken', cookie_token, {
              });
              
            res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/authCompleteProfile`);
            return {
                status:200,
                token : cookie_token,
                user:newUser,
                message:'the user create secssufully',
            }
        }
        else{
            const usertoken = await this.userservice.findByEmail(req.user.email);
            const cookie_token = await this.authservice.generateToken_2(usertoken);
            if (usertoken.ischange == false)
            {
                res.cookie('accessToken', cookie_token, {
                  });
                res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/authCompleteProfile`);
                return;
            }
            res.cookie('accessToken', cookie_token, {
              });
            if (usertoken.twofactorenabled == true)
            {
                res.cookie('accessToken', cookie_token);
                res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/login/2fa`);
                return;
            }
            res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/`);
            return{
                status:200,
                token: cookie_token,
                user:usertoken,
                message:'the user already exist'
            } 
        }
    }
}

@Controller('auth')
export class twoFactAuth_Controller{
    constructor(private readonly authservice:AuthService, private readonly jwtservice:JWToken){}
  
    @Post('qr-code')
    async generateQrCode(@Body() body: { currentUserID: Number}, @Res() res) {
        const qrCodeUri = await this.authservice.generateQrCodeUri(body.currentUserID);
        res.send({ qrCodeUri });
    }
  
    @Post('verify')
   async verifyToken(@Body() body: {QRCode: string, currentUserID: number }, @Res() res) {
      const isValid = await this.authservice.verifyToken(body.QRCode, body.currentUserID);
      if (isValid.isValid)
      {
        const cookie_token = await this.authservice.generateToken_2(isValid.user);
            const user2 = await this.jwtservice.decoded(cookie_token);
            res.send({message:'success',token:cookie_token,user:user2,isValid:isValid.isValid});
      }
      return { isValid };
    }

    @Post('toggletwofact')
    async Toggle(@Body() body: {currentUserID: Number }) {
       const isValid = await this.authservice.toggleTwoFact(body.currentUserID);
       return { isValid };
     }
}

@Controller('auth')
export class fortytwo_Controller{
    constructor(private readonly authservice:AuthService,private readonly usersrvice:UserService,private readonly jwtservice:JWToken){}
    @Get('42')
    @UseGuards(AuthGuard('42'))
    googlelogin(@Req() req,@Res() res){
    }
    notExists

    @Get('from-42')
    @UseGuards(AuthGuard('42'))
    async fortytwo_loginredirect(@Req() req, @Res() res ){
        const user = await req.user;
        const newUser = await this.authservice.create_Oauth(user);
        if (typeof newUser == 'object')
        {
            const cookie_token = await this.authservice.generateToken_2(newUser);
            res.cookie('accessToken', cookie_token, {
              });
              
              res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/authCompleteProfile`);
            const user_data = {token: cookie_token,
                user:newUser,
                message:'success'}
            return user_data;
        }
        else{
            const usertoken = await this.usersrvice.findByEmail(req.user.email);
            const cookie_token = await this.authservice.generateToken_2(usertoken);
            if (usertoken.ischange == false)
            {
                res.cookie('accessToken', cookie_token, {
                  });
                res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/authCompleteProfile`);
                return;
            }
            if (usertoken.twofactorenabled == true)
            {
                res.cookie('accessToken', cookie_token, {
                  });
                res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/login/2fa`);
                return;
            }
            res.cookie('accessToken', cookie_token, {
              });
            res.redirect(`http://${process.env.HOST}:${process.env.FRONT_PORT}/`);
            const user_data = {token: cookie_token,
                user:usertoken,
                message:'user already exist'}
            return user_data;
        }
    }
    @Put('complete')
    async completeProfile(@Body() Body, @Res() res){;
        delete Body.cookie;
        delete Body.avatar_url;
        if (await this.usersrvice.findByName(Body.username) != null)
        {
            res.send("invalid")
            return;
        }
        await this.usersrvice.update(Body,Body.id as number);
        const user = await this.usersrvice.findById(Body.id);
        if (user)
        {
            const cookie_token = await this.authservice.generateToken_2(user);
            res.send(cookie_token)
        }
        else
            res.send('Error');
    }
}