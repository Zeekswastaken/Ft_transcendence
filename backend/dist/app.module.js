"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const guards_1 = require("./auth/guards");
const user_service_1 = require("./user/user.service");
const user_controller_1 = require("./user/user.controller");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("./auth/jwt.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const channel_module_1 = require("./channel/channel.module");
const channel_service_1 = require("./channel/channel.service");
const chat_module_1 = require("./chat/chat.module");
const profile_module_1 = require("./profile/profile.module");
const config_1 = require("@nestjs/config");
const game_module_1 = require("./game/game.module");
const typeorm_2 = require("./config/typeorm");
const blocked_module_1 = require("./blocked/blocked.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [typeorm_2.default]
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => (configService.get('typeorm'))
            }),
            user_module_1.UserModule, auth_module_1.AuthModule, channel_module_1.ChannelModule, jwt_1.JwtModule.register({
                secret: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
                signOptions: { expiresIn: '24h' },
            }), chat_module_1.ChatModule, profile_module_1.ProfileModule, game_module_1.GameModule, blocked_module_1.BlockedModule
        ],
        controllers: [app_controller_1.AppController, user_controller_1.UserController],
        providers: [app_service_1.AppService, guards_1.TokenGuard, jwt_service_1.JWToken, user_service_1.UserService, channel_service_1.ChannelService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map