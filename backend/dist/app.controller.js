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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("./auth/guards");
const user_service_1 = require("./user/user.service");
const use_Dto_1 = require("./Dto/use.Dto");
const jwt_service_1 = require("./auth/jwt.service");
let AppController = class AppController {
    constructor(userservice, jwt) {
        this.userservice = userservice;
        this.jwt = jwt;
    }
    async default(res, req, query) {
        const status = req.user;
        console.log(status.message);
        if (status.status == 'unauthorized') {
            res.send(status);
            return {
                status: status,
            };
        }
        if (status.status == 'authorized') {
            console.log(query.avatar_url);
            const decoded = await this.jwt.decoded(status.token);
            const user = await this.userservice.findByName((decoded).username);
            res.send({ user: user, status: status });
        }
        console.log("status = " + status);
        return status;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.TokenGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, use_Dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "default", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_service_1.JWToken])
], AppController);
//# sourceMappingURL=app.controller.js.map