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
const message_entity_1 = require("./database/message.entity");
const guards_1 = require("./auth/guards");
const user_service_1 = require("./user/user.service");
const user_controller_1 = require("./user/user.controller");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("./auth/jwt.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const channel_entity_1 = require("./database/channel.entity");
const channelMembership_entity_1 = require("./database/channelMembership.entity");
const user_entity_1 = require("./database/user.entity");
const channel_module_1 = require("./channel/channel.module");
const channel_service_1 = require("./channel/channel.service");
const stats_entity_1 = require("./database/stats.entity");
const match_entity_1 = require("./database/match.entity");
const gameInvite_entity_1 = require("./database/gameInvite.entity");
const blockedUser_entity_1 = require("./database/blockedUser.entity");
const userFriends_entity_1 = require("./database/userFriends.entity");
const achievements_entity_1 = require("./database/achievements.entity");
const chat_module_1 = require("./chat/chat.module");
const profile_module_1 = require("./profile/profile.module");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'admin',
                password: 'pass',
                database: 'mydb',
                entities: [message_entity_1.Message, channel_entity_1.Channel, user_entity_1.User, channelMembership_entity_1.ChannelMembership, stats_entity_1.Stats, match_entity_1.Match, gameInvite_entity_1.GameInvite, blockedUser_entity_1.BlockedUser, userFriends_entity_1.UserFriends, achievements_entity_1.Achievements],
                logging: true,
                synchronize: true,
            }),
            user_module_1.UserModule, auth_module_1.AuthModule, channel_module_1.ChannelModule, jwt_1.JwtModule.register({
                secret: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
                signOptions: { expiresIn: '1h' },
            }), chat_module_1.ChatModule, profile_module_1.ProfileModule
        ],
        controllers: [app_controller_1.AppController, user_controller_1.UserController],
        providers: [app_service_1.AppService, guards_1.TokenGuard, jwt_service_1.JWToken, user_service_1.UserService, channel_service_1.ChannelService,],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map