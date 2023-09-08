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



@Controller('auth')
export class AuthController {
    constructor(private readonly authservice:AuthService,private readonly localStrategy:LocalStrategy,private readonly userservice:UserService,private readonly jwtservice:JWToken){}

    @Put('modify-data')
    async modyfiy(@Body() Body,@Res() res){
        console.log(Body);
        const decode = await this.jwtservice.decoded(Body.cookie);
        delete Body.cookie;
        delete Body.avatar_url;
        const id = decode.id as number;
        await this.userservice.update(Body,id);
        const user = await this.userservice.findById(id);
        console.log("Body = " +JSON.stringify(Body));
        if (user)
        {
            console.log(user);
            const cookie_token = await this.authservice.generateToken_2(user);
            console.log(await this.jwtservice.decoded(cookie_token));
            res.send(cookie_token)
            //res.redirect('localhost:3001/home')
        }
        else
            res.send('Error');
    }

    @Post('signup')
    async create(@Body() Body:UserDto,@Res() res){

        const ret = await this.authservice.check_and_create(Body);
        if(typeof ret == 'object')
        {
            console.log("Body = "+ret);
            const cookie_token = await this.authservice.generateToken_2(ret as User);
            console.log(await this.jwtservice.decoded(cookie_token));
            res.send(cookie_token);
        }
        else
             res.send({
                message: ret,
             })
    }

    @Post('login')
    async checking(@Body() Body:UserDto,@Res() res){

        // console.log(Body);
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
        // const decode = await this.jwtservice.decoded(Body.cookie);
        res.clearCookie('accessToken');
        res.status(200)
        // .redirect('localhost:3001/login');
    }
}

@Controller('auth')
export class googleController{
    constructor(private readonly authservice:AuthService,private readonly userservice:UserService){}
    //@UseGuards(TokenGuard)
    @UseGuards(AuthGuard('google'))
    @Get('google')
    googlelogin(){
        console.log("Auth/google");
        //response.redirect('https://accounts.google.com/v3/signin/identifier?opparams=%253F&dsh=S688648157%3A1690628583384724&client_id=154782931535-ftdo0053qmtsbcjb8rtpep6m13rhn7du.apps.googleusercontent.com&o2v=2&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Ffrom-google&response_type=code&scope=email+Profile&service=lso&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPGR2GqJKOJkkWG3gupm3W4L17g5-s-sQUjYdX252QPpvXeXcIxoHprz5jC5MeQqrTjvRkO9YUVj6IYV-hkvHdjISC9BmDveISvbv3jxN7DKvhzYAszlocGYx8ZYsbJ2cmFJjM_KY1D-J3O2A1Rc5Bwf-KWwrRIgfl8h20gD0uwWYc2tRYrbSX-Gd1DM7X_lZDkVx0aar6ABgIfviRXRe3ywIqaZNCC1TwalgolwmL5rBvxNt4PUE2QqPvhUrxt6EZOovckEdDSMkqetQ54tlZkaePYYnkAmem-jkAy4yFgx2dn18HkLMC8rNPg5rtanNdlYMlvqCwqwu4O4s3eYnU7RO6QBSGA8W35slYr06J4Y6Bxn1jHqypPD9eIabbR_4pay-0Wn7J_84dihPqT8TLb4_ulV0imSJYu9e6RTcxup609X3p5FTvxW_DIzJGdf11KFEIFzLkVw0jryd22tfW48j5kkA%26as%3DS688648157%253A1690628583384724%26client_id%3D154782931535-ftdo0053qmtsbcjb8rtpep6m13rhn7du.apps.googleusercontent.com%23&app_domain=http%3A%2F%2Flocalhost%3A3000&rart=ANgoxcdyRNwbgwnx4WL0BaKJ3lZkHaKfZx2HPFGhkw88O02V5z_0G19q6MtRyNpDdtXQINFZ7tBKgmnTcEBdnW_7YcLCCbG06g')
    }

    @UseGuards(AuthGuard('google'))
    @Get('from-google')
    async googleloginredirect(@Req() req, @Res() res){
        console.log("CallBack");
        const user = await req.user;
        console.log(user);
        const newUser = await this.authservice.create_Oauth(user);
        if (typeof newUser == 'object')
        {
            const cookie_token = await this.authservice.generateToken_2(newUser);

            res.cookie('accessToken', cookie_token, {
            //httpOnly: true,
              });
              
            res.redirect("http://localhost:3001/");
            //res.sendFile('/Users/orbiay/Desktop/Ft_Transcendance/Model/views/home.html');
            console.log('coockie token = '+ cookie_token);
            //res.status(200).redirect("http://localhost:3001/");
            return {
                status:200,
                token : cookie_token,
                user:newUser,
                message:'the user create secssufully',
            }
        }
        else{
            //console.log('error');
            const usertoken = await this.userservice.findByName(req.user.username);
            const cookie_token = await this.authservice.generateToken_2(usertoken);
            res.cookie('accessToken', cookie_token, {
               // httpOnly: true,
              });
              
              res.redirect("http://localhost:3001/");
            console.log('coockie token = '+ cookie_token + "\n\n\n\n");

            //res.sendFile('/Users/orbiay/Desktop/Ft_Transcendance/Model/views/home.html');
            //res.status(200).redirect("http://localhost:3001/");
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
    constructor(private readonly authservice:AuthService){}
  
    @Post('qr-code')
    async generateQrCode(@Body() body: { userid: Number}, @Res() res) {
        // const id = 1;
        const qrCodeUri = await this.authservice.generateQrCodeUri(body.userid);
        res.send({ qrCodeUri });
    }
  
    @Post('verify')
   async verifyToken(@Body() body: {token: string, userid: Number }) {
    console.log("Body.token === ", body.token, " Body.userid====== ", body.userid);
      const isValid = await this.authservice.verifyToken(body.token, body.userid);
      console.log("isvalid ", isValid)
      return { isValid };
    }
}

@Controller('auth')
export class fortytwo_Controller{
    constructor(private readonly authservice:AuthService,private readonly usersrvice:UserService){}
    @Get('42')
    @UseGuards(AuthGuard('42'))
    // @UseGuards(TokenGuard)
    googlelogin(@Req() req,@Res() res){
        console.log("heloWorld")
    }
    notExists

    @Get('from-42')
    @UseGuards(AuthGuard('42'))
    async fortytwo_loginredirect(@Req() req, @Res() res ){
        console.log("CallBack");
        const user = await req.user;
        const newUser = await this.authservice.create_Oauth(user);
        console.log("New User = "+ newUser);
        if (typeof newUser == 'object')
        {
            console.log("Fist time")
            const cookie_token = await this.authservice.generateToken_2(newUser);
            res.cookie('accessToken', cookie_token, {
                // httpOnly: true,
              });
              
              //res.redirect("http://localhost:3001/");
              res.redirect("http://localhost:3001/");
            const user_data = {token: cookie_token,
                user:newUser,
                message:'success'}
                console.log(user_data);
            return user_data;
        }
        else{
            const usertoken = await this.usersrvice.findByName(req.user.username);
            console.log(usertoken);
            const cookie_token = await this.authservice.generateToken_2(usertoken);
            res.cookie('accessToken', cookie_token, {
                // httpOnly: true
              });
              
            console.log('coockie token = '+ cookie_token);
            //res.status(201);
            //res.setHeader('Authorization', `Bearer ${cookie_token}`);
            //res.sendFile('/Users/orbiay/Desktop/App2/app/views/home.html');
            //res.redirect("http://localhost:3001/");
            res.redirect("http://localhost:3001/");
            const user_data = {token: cookie_token,
                user:usertoken,
                message:'user already exist'}
                console.log(usertoken );
            return user_data;
        }
    }
}