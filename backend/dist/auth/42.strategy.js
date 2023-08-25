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
exports.fortytwo_Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
let fortytwo_Strategy = class fortytwo_Strategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor() {
        super({
            clientID: 'u-s4t2ud-97201b0b9664120cef3e2130f4f15b0f1993c65c776a8593967c46214ef534d6',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/from-42',
        });
    }
    async validate(accessToken, refreshToken, profile) {
        const { name, emails, _json } = profile;
        const firstName = name === null || name === void 0 ? void 0 : name.givenName;
        const user = {
            username: firstName,
            email: emails[0].value,
            avatar_url: _json.image.versions.small,
        };
        return user;
    }
};
exports.fortytwo_Strategy = fortytwo_Strategy;
exports.fortytwo_Strategy = fortytwo_Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], fortytwo_Strategy);
//# sourceMappingURL=42.strategy.js.map