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
exports.ChannelMembership = void 0;
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const user_entity_1 = require("./user.entity");
const message_entity_1 = require("./message.entity");
let ChannelMembership = exports.ChannelMembership = class ChannelMembership {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelMembership.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChannelMembership.prototype, "Userid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ChannelMembership.prototype, "Channelid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelMembership.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChannelMembership.prototype, "isMuted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChannelMembership.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: null, nullable: true }),
    __metadata("design:type", Date)
], ChannelMembership.prototype, "muteEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: null, nullable: true }),
    __metadata("design:type", Date)
], ChannelMembership.prototype, "banEndDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel, channel => channel.memberships),
    (0, typeorm_1.JoinColumn)({ name: 'Channelid', referencedColumnName: 'id' }),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelMembership.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.memberships),
    (0, typeorm_1.JoinColumn)({ name: 'Userid', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.User)
], ChannelMembership.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.membership),
    __metadata("design:type", Array)
], ChannelMembership.prototype, "messages", void 0);
exports.ChannelMembership = ChannelMembership = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["Channelid", "Userid"])
], ChannelMembership);
//# sourceMappingURL=channelMembership.entity.js.map