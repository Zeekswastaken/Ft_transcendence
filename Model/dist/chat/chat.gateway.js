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
let WebsocketGateway = exports.WebsocketGateway = class WebsocketGateway {
    constructor(chatservice, jwt) {
        this.chatservice = chatservice;
        this.jwt = jwt;
    }
    async handleConnection(client) {
        const token = client.handshake.query.token;
        if (await this.jwt.verify(token)) {
            const user = await this.jwt.decoded(token);
            const rooms = await this.chatservice.getAllRooms(user.id);
            rooms.forEach(room => { client.join(room); });
            console.log(`Client connected: ${client.id}`);
        }
    }
    handleDisconnect(client) {
        const token = client.handshake.query.token;
        console.log(`Client disconnected: ${client.id}`);
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
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('Duo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleMessage", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService, jwt_service_1.JWToken])
], WebsocketGateway);
//# sourceMappingURL=chat.gateway.js.map