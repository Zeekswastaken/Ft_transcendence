import { Injectable, Res } from '@nestjs/common';
import { promises } from 'dns';
import { Response } from 'express';
import { UserDto, jwtDTO } from 'src/Dto/use.Dto';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { JWToken } from './jwt.service';
import { checkPasswordStrength } from 'src/utils/passwordChecker';
import { Stats } from 'src/database/stats.entity';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';
@Injectable()
export class AuthService {
    constructor(private readonly userservice:UserService,private readonly jwtoken:JWToken){}
    // singin(@Res() res:Response){
    //     res.sendFile('/Users/orbiay/Desktop/App2/app/views/login.html');
    // }
    // singup(@Res() res:Response){
    //     res.sendFile('/Users/orbiay/Desktop/App2/app/views/signup.html');
    // }

    async generateSecret(userid:Number): Promise<User> {
        const user = await this.userservice.findById(userid);
        user.twofactorsecret = otplib.authenticator.generateSecret();
        await this.userservice.save(user);
        return (user);
    }

    async generateQrCodeUri(userid: Number): Promise<string> {
        let user = await this.userservice.findById(userid);
        console.log("=----> ", user);
        user = await this.generateSecret(user.id); // Await the secret generation
        console.log("SECRET ==== ", user.twofactorsecret);
        const otpauthURL = otplib.authenticator.keyuri(
            user.username.valueOf(),
            "Pong",
            user.twofactorsecret
        );
        const qrCodeDataURL = await qrcode.toDataURL(otpauthURL);
        user.qr_code_url = qrCodeDataURL;
        await this.userservice.save(user);
        return qrCodeDataURL;
    }

    async verifyToken(token: string, userid: number): Promise<boolean> {
        const user = await this.userservice.findById(userid);
        console.log("------------");
        // console.log("HERE ======> ", user.twofactorsecret);
        console.log("*****", user.twofactorsecret, "********");
        console.log("*****+", token,"********");
        const secret = user.twofactorsecret;
        const isValid = otplib.authenticator.verify({ token, secret });
        
        if (isValid) {
            return true;
        } else {
            console.log('Invalid token');
            return false;
        }
    }

    async enableTwoFact(userid:Number)
    {
        const user = await this.userservice.findById(userid);
        user.twofactorenabled = true;
        await this.userservice.save(user);
    }

    async check_and_create(body:UserDto):Promise<String | boolean | User>{
        if (!body.username)
            return 'empty';
        if (checkPasswordStrength(body.password) == 'Weak')
            return 'weak';
        if (body.password == body.repassword)
        {
            if (await this.userservice.findByName(body.username) == null)
            {
                const user = new User();
               // console.log("************>>"+user.id);
                user.username = body.username;
                user.password = await  this.userservice.hashpassword(body.password) ;
                user.avatar_url = body.avatar_url;
                await this.userservice.save(user);
                console.log("************>>"+user.id);

                const stats = new Stats();
                stats.level = 0;
                stats.losses = 0;
                stats.matches_played = 0;
                stats.winrate = 0;
                stats.wins = 0;
                user.stats = stats;
                stats.user = user;
                await this.userservice.saveStat(stats);
                //this.userservice.initStats(body);
                await this.userservice.save(user);
                console.log("************>>"+user.id);

                //await this.userservice.initStats(await this.userservice.findByName(body.username));
                return user;
            }
            else 
                return 'exists';
        }
        else
            return 'notMatch';
    }
    async validate_by_username(username:String,password:String) :Promise<User | null>
    {
        const user = await this.userservice.findByName(username);
        if (user  && user.password && await this.userservice.compare(password,user.password) && user.password != 'Oauth' )
        {
            console.log(user);
            return user;
        }
        else 
        {
            console.log(user)
            return null;
        }
    }
    async create_Oauth(body:UserDto):Promise<boolean | User>
    {
       const user1 = await this.userservice.findByName(body.username );
       if (!user1)
       {
            console.log(body);
            const user = new User();
            user.username = body.username ;
            user.avatar_url = body.avatar_url;  
            await this.userservice.save(user);
            const stats = new Stats();
            stats.level = 0;
            stats.losses = 0;
            stats.matches_played = 0;
            stats.winrate = 0;
            stats.wins = 0;
            user.stats = stats;
            stats.user = user;
            await this.userservice.saveStat(stats);
            console.log("BEFORE")
            await this.userservice.save(user);
            console.log("AFTER");
            console.log("************>>"+user.id);
            //exit(0);
            return user;
       }
        else
            return false;
    }
    // async generatOken(user:Partial<User>){
    //     console.log(user);
    //     return await this.jwtoken.generateToken(user);
    // }
    async generateToken_2(user:Partial<User>)
    {
        return await this.jwtoken.generateToken_2(user);
    }
    async isValid(token:String)
    {
        return await this.jwtoken.verify(token);
    }
}
