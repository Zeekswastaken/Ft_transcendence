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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const channelMembership_entity_1 = require("./channelMembership.entity");
const stats_entity_1 = require("./stats.entity");
const gameInvite_entity_1 = require("./gameInvite.entity");
const match_entity_1 = require("./match.entity");
const blockedUser_entity_1 = require("./blockedUser.entity");
let User = exports.User = User_1 = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Oauth' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "privacy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "Bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU" }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channelMembership_entity_1.ChannelMembership, membership => membership.user, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "memberships", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1, user => user.friends),
    (0, typeorm_1.JoinTable)({ name: 'userFriends' }),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stats_entity_1.Stats, stats => stats.user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", stats_entity_1.Stats)
], User.prototype, "stats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gameInvite_entity_1.GameInvite, invite => invite.sender, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "sentInvites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gameInvite_entity_1.GameInvite, invite => invite.receiver, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "receivedInvites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (matchHisory) => matchHisory.player1, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "player1", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (matchHisory) => matchHisory.player2, { cascade: true, onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "player2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => blockedUser_entity_1.BlockedUser, blockedUser => blockedUser.blockedBy),
    __metadata("design:type", Array)
], User.prototype, "blockedUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => blockedUser_entity_1.BlockedUser, blockedUser => blockedUser.blockedUser),
    __metadata("design:type", Array)
], User.prototype, "usersBlocked", void 0);
exports.User = User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map