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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const channelMembership_entity_1 = require("./channelMembership.entity");
let Message = class Message {
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Message.prototype, "Created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channelMembership_entity_1.ChannelMembership, membership => membership.messages),
    (0, typeorm_1.JoinColumn)({ name: 'Userid', referencedColumnName: 'Userid', }),
    (0, typeorm_1.JoinColumn)({ name: 'Channelid', referencedColumnName: 'Channelid' }),
    __metadata("design:type", channelMembership_entity_1.ChannelMembership)
], Message.prototype, "membership", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)()
], Message);
//# sourceMappingURL=message.entity.js.map