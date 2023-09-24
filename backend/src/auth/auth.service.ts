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

    async generateSecret(userid:Number): Promise<User> {
        const user = await this.userservice.findById(userid);
        user.twofactorsecret = otplib.authenticator.generateSecret();
        user.twofactorenabled = true;
        await this.userservice.save(user);
        return (user);
    }

    async generateQrCodeUri(userid: Number): Promise<string> {
        let user = await this.userservice.findById(userid);
        user = await this.generateSecret(user.id); // Await the secret generation
        const otpauthURL = otplib.authenticator.keyuri(
            user.username.valueOf(),
            "Pong",
            user.twofactorsecret
        );
        const qrCodeDataURL = await qrcode.toDataURL(otpauthURL);
        return qrCodeDataURL;
    }

    async verifyToken(token: string, userid: number): Promise<any> {
        const user = await this.userservice.findById(userid);
        const secret = user.twofactorsecret;
        const isValid = otplib.authenticator.verify({ token, secret });
        const obj = {
            user:user,
            isValid:isValid
        }
        if (isValid) {
            return obj;
        } else {
            return obj;
        }
    }

    async toggleTwoFact(userid:Number)
    {
        const user = await this.userservice.findById(userid);
        if (user)
        {
            if (user.twofactorenabled == true)
                user.twofactorenabled = false;
            else
                user.twofactorenabled = true;
            await this.userservice.save(user);
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
                user.username = body.username;
                user.password = await  this.userservice.hashpassword(body.password) ;
                user.avatar_url = body.avatar_url;
                await this.userservice.save(user);
                const stats = new Stats();
                stats.level = 0;
                stats.losses = 0;
                stats.matches_played = 0;
                stats.winrate = 0;
                stats.score = 0;
                stats.matches = [];
                stats.wins = 0;
                user.stats = stats;
                stats.user = user;
                await this.userservice.saveStat(stats);
                await this.userservice.save(user);

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
            return user;
        }
        else 
        {
            return null;
        }
    }
    async create_Oauth(body:UserDto):Promise<boolean | User>
    {
       const user1 = await this.userservice.findByEmail(body.email);
       if (!user1)
       {
            const user = new User();
            user.username = body.username ;
            user.avatar_url = body.avatar_url;  
            user.email = body.email;
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
            await this.userservice.save(user);
            return user;
       }
        else
            return false;
    }
    async generateToken_2(user:Partial<User>)
    {
        return await this.jwtoken.generateToken_2(user);
    }
    async isValid(token:String)
    {
        return await this.jwtoken.verify(token);
    }
}
