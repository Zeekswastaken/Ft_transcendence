import {  PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-google-oauth20';
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(){
        super({
            clientID:'154782931535-ftdo0053qmtsbcjb8rtpep6m13rhn7du.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'http://10.14.3.7:3000/auth/from-google',
            scope:['email','Profile'],
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        // Access the tokens
        //console.log('Access Token:', accessToken);
        //console.log('Refresh Token:', refreshToken);

        console.log( "Profile = " + JSON.stringify(Profile));
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