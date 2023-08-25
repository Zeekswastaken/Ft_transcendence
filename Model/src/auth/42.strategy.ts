import { Injectable } from "@nestjs/common";
import {  PassportStrategy } from "@nestjs/passport";
import { Strategy ,Profile} from 'passport-42';
@Injectable()
export class fortytwo_Strategy extends PassportStrategy(Strategy,'42'){
    constructor(){
        super({
            clientID:'u-s4t2ud-97201b0b9664120cef3e2130f4f15b0f1993c65c776a8593967c46214ef534d6',
            clientSecret:'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',
            callbackURL:'http://localhost:3000/auth/from-42',
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        // Access the tokens
        //console.log('Access Token:', accessToken);
        //console.log('Refresh Token:', refreshToken);
        const {  name, emails , _json } = profile;
        const firstName = name?.givenName
        const user = {
          username:firstName,
          email: emails[0].value,
          avatar_url:_json.image.versions.small,
        };
        return user;
      }
}