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
exports.WebsocketGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const jwt_service_1 = require("../auth/jwt.service");
const user_service_1 = require("../user/user.service");
let WebsocketGateway = class WebsocketGateway {
    constructor(chatservice, jwt, userservice) {
        this.chatservice = chatservice;
        this.jwt = jwt;
        this.userservice = userservice;
        this.users = new Map();
    }
    async handleConnection(client) {
    }
    async getSocketId(client, obj) {
        if (await this.jwt.verify(obj.token)) {
            const user = await this.jwt.decoded(obj.token);
            user.Socket = client.id;
            user.status = 'Online';
            console.log(" chat.id == " + client.id);
            await this.userservice.update(user, user.id);
            const newUser = await this.userservice.findByName(user.username);
            const token = await this.jwt.generateToken_2(user);
            this.users.set(client.id, token);
            client.to(client.id).emit('accessToken', token);
        }
    }
    async status(client) {
        const token = this.users.get(client.id);
        client.emit('GetUserStatus', token);
    }
    async handleDisconnect(client) {
        const token = this.users.get(client.id);
        if (token) {
            const user = await this.jwt.decoded(token);
            user.status = 'Offline';
            await this.userservice.update(user, user.id);
            console.log("user disconnect ==> " + JSON.stringify(user));
            console.log(`chat.Client disconnected: ${client.id}`);
            this.users.delete(client.id);
        }
    }
    afterInit(server) {
        console.log('WebSocket gateway initialized');
    }
    async handleMessage(client, payload) {
        const token = client.handshake.query.token;
        if (await this.jwt.verify(token)) {
            const user = await this.jwt.decoded(token);
            if (this.chatservice.isMatched(payload.channelName, user.id)) {
                client.to(payload.channelName).emit(payload.text);
                await this.chatservice.saveMsg({ text: payload.text });
            }
        }
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('getSocketId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "getSocketId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('UserStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "status", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('Duo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleMessage", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService, jwt_service_1.JWToken, user_service_1.UserService])
], WebsocketGateway);
//# sourceMappingURL=chat.gateway.js.map