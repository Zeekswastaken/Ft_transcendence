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
exports.BlockedUser = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let BlockedUser = exports.BlockedUser = class BlockedUser {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlockedUser.prototype, "BlockedId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.blockedUsers),
    (0, typeorm_1.JoinColumn)({ name: 'BlockedById' }),
    __metadata("design:type", user_entity_1.User)
], BlockedUser.prototype, "blockedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.usersBlocked),
    (0, typeorm_1.JoinColumn)({ name: 'BlockedUserId' }),
    __metadata("design:type", user_entity_1.User)
], BlockedUser.prototype, "blockedUser", void 0);
exports.BlockedUser = BlockedUser = __decorate([
    (0, typeorm_1.Entity)()
], BlockedUser);
;
//# sourceMappingURL=blockedUser.entity.js.map