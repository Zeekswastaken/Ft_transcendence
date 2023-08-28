"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const local_startegy_1 = require("./local.startegy");
const user_service_1 = require("../user/user.service");
const user_module_1 = require("../user/user.module");
const google_startegy_1 = require("./google.startegy");
const _42_strategy_1 = require("./42.strategy");
const passport_1 = require("@nestjs/passport");
const guards_1 = require("./guards");
const jwt_service_1 = require("./jwt.service");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, passport_1.PassportModule.register({ defaultStrategy: '42' }), jwt_1.JwtModule.register({
                secret: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
                signOptions: { expiresIn: '24h' },
            })],
        providers: [auth_service_1.AuthService, local_startegy_1.LocalStrategy, user_service_1.UserService, google_startegy_1.GoogleStrategy, _42_strategy_1.fortytwo_Strategy, guards_1.TokenGuard, jwt_service_1.JWToken],
        controllers: [auth_controller_1.AuthController, auth_controller_1.googleController, auth_controller_1.fortytwo_Controller]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map