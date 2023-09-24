import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import {jwtDTO } from 'src/Dto/use.Dto';
import { User } from 'src/database/user.entity';

@Injectable()
export class JWToken{
  constructor(private readonly jwtService: JwtService) {}

    private secret_key:String = '0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    async generateToken_2(user:Partial<User>):Promise<String>{
      const obj = {id:user.id,email:user.email,username:user.username,gender:user.gender,birthDay:user.birthDay,twofactorenabled:user.twofactorenabled,avatar_url:user.avatar_url,status:user.status,Socket:user.Socket,PlayerSocket:user.PlayerSocket};
        return  this.jwtService.sign(obj,{secret:process.env.JWT_SECRET});
    }
    async verify(token):Promise<boolean>
    {
        try 
        {
          if (token)
          {
            const decoded = await this.jwtService.verifyAsync(token, {secret:this.secret_key.toString()});
            return true;
          }
          else 
            return false;
        } 
        catch (error) {
          if (error instanceof TokenExpiredError) {
            console.error('Token has expired:', error.message);
          } else if (error instanceof JsonWebTokenError) {
            console.error('Invalid token:', error.message);
          } else {
            console.error('Token verification failed:', error);
          }
          return false; // Token is invalid
        }
    }
    async decoded (token):Promise<null|User>{
      try 
        {
          if (token)
          {
            const user = await this.jwtService.verifyAsync(token, {secret:this.secret_key.toString()});
            delete user.iat;
            delete user.exp;
            return user;
          }
          else 
            return null;
        } 
        catch (error) {
          return error; // Token is invalid
        }
    }
  }