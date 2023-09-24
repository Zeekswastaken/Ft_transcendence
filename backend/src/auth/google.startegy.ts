import {  PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-google-oauth20';
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(){
        super({
            clientID:process.env.GOOGLE_CLIENTID,
            clientSecret:process.env.GOOGLE_CLIENTSECRET,
            callbackURL:`http://${process.env.HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK}`,
            scope:['email','Profile'],
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {

        const {  name, emails ,photos} = profile;
        const firstName = name?.givenName;
        const user = {
          username:firstName,
          email: emails[0].value, 
          avatar_url:photos[0].value,
        };

        return user;
      }
}