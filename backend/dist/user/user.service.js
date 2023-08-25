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
exports.UserService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/user.entity");
const stats_entity_1 = require("../database/stats.entity");
let UserService = class UserService {
    constructor(userRepo, statsRepository) {
        this.userRepo = userRepo;
        this.statsRepository = statsRepository;
    }
    async compare(password, hashedone) {
        return await bcrypt.compare(password, hashedone);
    }
    async hashpassword(password) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
    async save(Body) {
        await this.userRepo.save(Body);
    }
    async update(Body, id) {
        console.log("id = " + id);
        await this.userRepo.update(id, Body);
    }
    async findByName(username) {
        const user = await this.userRepo.findOne({ where: { username: username }, relations: ['stats'] });
        return user;
    }
    async findById(id) {
        const user = await this.userRepo.findOne({ where: { id: id } });
        return user;
    }
    async create(User) {
        await this.userRepo.create(User);
    }
    async saveStat(stat) {
        await this.statsRepository.save(stat);
    }
    async initStats(user) {
        const stats = new stats_entity_1.Stats();
        stats.winrate = 0;
        stats.wins = 0;
        stats.losses = 0;
        stats.level = 0;
        stats.matches_played = 0;
        stats.user = user;
        return await this.statsRepository.save(stats);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(stats_entity_1.Stats)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map