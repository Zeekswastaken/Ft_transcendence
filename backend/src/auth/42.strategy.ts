import { Injectable } from "@nestjs/common";
import {  PassportStrategy } from "@nestjs/passport";
import { Strategy ,Profile} from 'passport-42';
@Injectable()
export class fortytwo_Strategy extends PassportStrategy(Strategy,'42'){
    constructor(){
        super({
            clientID:process.env.FORTYTWO_CLIENTID,
            clientSecret:process.env.FORTYTWO_CLIENTSECRET,
            callbackURL:`http://${process.env.HOST}:${process.env.PORT}${process.env.FORYTWO_CALLBACK}`,
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        // Access the tokens
        //console.log('Access Token:', accessToken);
        //console.log('Refresh Token:', refreshToken);
        const {  username, emails , _json } = profile;
        const firstName = username
        const user = {
          username:firstName,
          email: emails[0].value,
          avatar_url:_json.image.versions.small,
        };
        return user;
      }
}