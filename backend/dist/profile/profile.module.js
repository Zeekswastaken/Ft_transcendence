"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const profile_controller_1 = require("./profile.controller");
const profile_service_1 = require("./profile.service");
const user_service_1 = require("../user/user.service");
const user_module_1 = require("../user/user.module");
const jwt_service_1 = require("../auth/jwt.service");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const friends_module_1 = require("../friends/friends.module");
const friends_service_1 = require("../friends/friends.service");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, auth_module_1.AuthModule, friends_module_1.FriendsModule],
        controllers: [profile_controller_1.ProfileController],
        providers: [profile_service_1.ProfileService, user_service_1.UserService, jwt_service_1.JWToken, jwt_1.JwtService, friends_service_1.FriendsService]
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map