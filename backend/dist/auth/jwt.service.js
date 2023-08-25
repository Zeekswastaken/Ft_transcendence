"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWToken = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jsonwebtoken_1 = require("jsonwebtoken");
let JWToken = class JWToken {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.secret_key = '0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    }
    async generateToken_2(user) {
        const obj = { id: user.id, username: user.username, gender: user.gender, birthday: user.birthDay, avatar_URL: user.avatar_url };
        return this.jwtService.sign(obj, { secret: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" });
    }
    async verify(token) {
        try {
            if (token) {
                const decoded = await this.jwtService.verifyAsync(token, { secret: this.secret_key.toString() });
                console.log('Decoded:', decoded);
                return true;
            }
            else
                return false;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                console.error('Token has expired:', error.message);
            }
            else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                console.error('Invalid token:', error.message);
            }
            else {
                console.error('Token verification failed:', error);
            }
            return false;
        }
    }
    async decoded(token) {
        try {
            if (token) {
                const user = await this.jwtService.verifyAsync(token, { secret: this.secret_key.toString() });
                return user;
            }
            else
                return null;
        }
        catch (error) {
            console.log('4---------------->>>>');
            return error;
        }
    }
};
exports.JWToken = JWToken;
exports.JWToken = JWToken = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JWToken);
//# sourceMappingURL=jwt.service.js.map