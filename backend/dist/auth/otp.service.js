"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPservice = void 0;
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
class OTPservice {
    constructor() {
        this.transporter = nodemailer.transport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: 'your-email',
                clientId: 'your-client-id',
                clientSecret: 'your-client-secret',
            }
        });
    }
    generateOTP() {
        return speakeasy.totp({ digits: 6 });
        ;
    }
}
exports.OTPservice = OTPservice;
//# sourceMappingURL=otp.service.js.map