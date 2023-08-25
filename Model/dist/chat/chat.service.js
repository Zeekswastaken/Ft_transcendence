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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channelMembership_entity_1 = require("../database/channelMembership.entity");
const message_entity_1 = require("../database/message.entity");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
let ChatService = exports.ChatService = class ChatService {
    constructor(ChannelMRepo, msg) {
        this.ChannelMRepo = ChannelMRepo;
        this.msg = msg;
    }
    async getAllRooms(Userid) {
        const rooms = await this.ChannelMRepo.find({
            where: { Userid: (0, typeorm_3.Equal)(Userid) }, relations: ['Channel'],
        });
        if (rooms) {
            const channelNames = rooms.map(membership => membership.channel.Name);
            return channelNames;
        }
        else
            return null;
    }
    async isMatched(Name, Userid) {
        const rooms = await this.getAllRooms(Userid);
        return rooms.some(room => room === Name);
    }
    async saveMsg(text) {
        this.msg.save(text);
    }
};
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channelMembership_entity_1.ChannelMembership)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map