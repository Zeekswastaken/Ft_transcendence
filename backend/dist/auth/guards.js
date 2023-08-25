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
exports.TokenGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("./jwt.service");
let TokenGuard = class TokenGuard {
    constructor(jwtToken) {
        this.jwtToken = jwtToken;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const token = req.body.token;
        console.log("mytoken = " + token);
        if (token) {
            if (await this.jwtToken.verify(token)) {
                console.log('Token is valid\n');
                req.user = { status: 'authorized', message: 'token valid', token: token };
                return true;
            }
        }
        req.user = { status: 'unauthorized', message: 'token isn\'t valid', token: null };
        return true;
    }
};
exports.TokenGuard = TokenGuard;
exports.TokenGuard = TokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JWToken])
], TokenGuard);
//# sourceMappingURL=guards.js.map