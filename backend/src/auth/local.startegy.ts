import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "./auth.service";
import { User } from "src/database/user.entity";
import { Injectable } from "@nestjs/common";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authservice:AuthService){
        super();
    }
    async validate(username:String , password:String):Promise<User | null>{

        const user = await this.authservice.validate_by_username(username,password);
        if (!user)
        {
            return null;
        }
        return user;
    }
}