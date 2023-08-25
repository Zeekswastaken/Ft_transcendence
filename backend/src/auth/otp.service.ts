import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
export class OTPservice{
    generateOTP():String{
        return speakeasy.totp({ digits: 6 });;
    }
    transporter:Object = nodemailer.transport({
        service:'Gmail',
        auth:
        {
            type: 'OAuth2',
            user: 'your-email',
            clientId: 'your-client-id',
            clientSecret: 'your-client-secret',
        }

    })
}