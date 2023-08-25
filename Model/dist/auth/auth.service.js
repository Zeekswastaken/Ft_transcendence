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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../database/user.entity");
const user_service_1 = require("../user/user.service");
const jwt_service_1 = require("./jwt.service");
const passwordChecker_1 = require("../utils/passwordChecker");
const stats_entity_1 = require("../database/stats.entity");
let AuthService = exports.AuthService = class AuthService {
    constructor(userservice, jwtoken) {
        this.userservice = userservice;
        this.jwtoken = jwtoken;
    }
    async check_and_create(body) {
        if (!body.username)
            return 'empty';
        if ((0, passwordChecker_1.checkPasswordStrength)(body.password) == 'Weak')
            return 'weak';
        if (body.password == body.repassword) {
            if (await this.userservice.findByName(body.username) == null) {
                const user = new user_entity_1.User();
                user.username = body.username;
                user.password = await this.userservice.hashpassword(body.password);
                user.avatar_url = body.avatar_url;
                await this.userservice.save(user);
                console.log("************>>" + user.id);
                const stats = new stats_entity_1.Stats();
                stats.level = 0;
                stats.losses = 0;
                stats.matches_played = 0;
                stats.winrate = 0;
                stats.wins = 0;
                user.stats = stats;
                stats.user = user;
                await this.userservice.saveStat(stats);
                await this.userservice.save(user);
                console.log("************>>" + user.id);
                return user;
            }
            else
                return 'exists';
        }
        else
            return 'notMatch';
    }
    async validate_by_username(username, password) {
        const user = await this.userservice.findByName(username);
        if (user && user.password && await this.userservice.compare(password, user.password) && user.password != 'Oauth') {
            console.log(user);
            return user;
        }
        else {
            console.log(user);
            return null;
        }
    }
    async create_Oauth(body) {
        const user1 = await this.userservice.findByName(body.username);
        if (!user1) {
            console.log(body);
            const user = new user_entity_1.User();
            user.username = body.username;
            user.avatar_url = body.avatar_url;
            await this.userservice.save(user);
            const stats = new stats_entity_1.Stats();
            stats.level = 0;
            stats.losses = 0;
            stats.matches_played = 0;
            stats.winrate = 0;
            stats.wins = 0;
            user.stats = stats;
            stats.user = user;
            await this.userservice.saveStat(stats);
            console.log("BEFORE");
            await this.userservice.save(user);
            console.log("AFTER");
            console.log("************>>" + user.id);
            return user;
        }
        else
            return false;
    }
    async generateToken_2(user) {
        return await this.jwtoken.generateToken_2(user);
    }
    async isValid(token) {
        return await this.jwtoken.verify(token);
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_service_1.JWToken])
], AuthService);
//# sourceMappingURL=auth.service.js.map