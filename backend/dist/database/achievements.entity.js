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
exports.Achievements = void 0;
const typeorm_1 = require("typeorm");
const stats_entity_1 = require("./stats.entity");
let Achievements = class Achievements {
};
exports.Achievements = Achievements;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Achievements.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Achievements.prototype, "icon_URL", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Achievements.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stats_entity_1.Stats, stats => stats.achievements),
    (0, typeorm_1.JoinColumn)({ name: "statsId" }),
    __metadata("design:type", stats_entity_1.Stats)
], Achievements.prototype, "stats", void 0);
exports.Achievements = Achievements = __decorate([
    (0, typeorm_1.Entity)()
], Achievements);
//# sourceMappingURL=achievements.entity.js.map