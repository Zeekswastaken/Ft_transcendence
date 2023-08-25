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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("../database/channel.entity");
const channelMembership_entity_1 = require("../database/channelMembership.entity");
const user_entity_1 = require("../database/user.entity");
const bcrypt = require("bcrypt");
const typeorm_3 = require("typeorm");
console.log("HEETEe");
let ChannelService = class ChannelService {
    constructor(channelRepository, channelMembershipRepository, userRepository) {
        this.channelRepository = channelRepository;
        this.channelMembershipRepository = channelMembershipRepository;
        this.userRepository = userRepository;
        console.log('ChannelRepository:', channelRepository);
        console.log('ChannelMembershipRepository:', channelMembershipRepository);
        console.log('UserRepository:', userRepository);
    }
    async createChannel(createChannelDto, owner) {
        console.log('--------> ', createChannelDto.Name);
        console.log('--------> ', createChannelDto.Type);
        console.log('--------> ', createChannelDto.Password);
        const channel = new channel_entity_1.Channel();
        if (createChannelDto.Type == null)
            createChannelDto.Type = "public";
        if (createChannelDto.Name == undefined)
            throw new common_1.HttpException("Channel name or Type not specified", common_1.HttpStatus.FORBIDDEN);
        channel.Name = createChannelDto.Name;
        channel.Type = createChannelDto.Type;
        const checkChannel = await this.channelRepository.findOne({ where: { Name: createChannelDto.Name } });
        if (checkChannel)
            throw new common_1.HttpException("Channel already exists with the same name", common_1.HttpStatus.FORBIDDEN);
        if (createChannelDto.Type === "protected" && createChannelDto.Password) {
            const hashedPass = await this.hashPassword(createChannelDto.Password);
            channel.Password = hashedPass;
        }
        if (createChannelDto.Type === "protected" && !createChannelDto.Password)
            throw new common_1.HttpException('Password required', common_1.HttpStatus.FORBIDDEN);
        const savedChannel = await this.channelRepository.save(channel);
        const membership = new channelMembership_entity_1.ChannelMembership();
        membership.Userid = owner;
        membership.Channelid = savedChannel.id;
        membership.Type = "owner";
        await this.channelMembershipRepository.save(membership);
        return savedChannel;
    }
    async assignAdmin(channelID, userId, initiatorId) {
        const initiator = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(initiatorId) } });
        console.log("-------8888-> ");
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        console.log("-------8899988-> ");
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userId) } });
        if (!channel || !user || !initiator)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        console.log("-------88101010188-> ");
        const membership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) },
                Type: 'admin'
            } });
        console.log("-------88111111188-> ");
        if (membership)
            throw new common_1.HttpException("The user is already an admin", common_1.HttpStatus.FORBIDDEN);
        const membership_init = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(initiatorId) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) },
                Type: 'owner'
            } });
        if (!membership_init)
            throw new common_1.HttpException("The user can only assign someone as admin if he's the owner of this channel", common_1.HttpStatus.FORBIDDEN);
        const adminmembership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) }
            }
        });
        if (!adminmembership)
            throw new common_1.HttpException("The user hasn't joined this channel", common_1.HttpStatus.FORBIDDEN);
        adminmembership.Type = 'admin';
        console.log("-------8888-> ", adminmembership.Type);
        return await this.channelMembershipRepository.save(adminmembership);
    }
    async removeAdmin(channelID, userID, initiatorID) {
        const initiator = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(initiatorID) } });
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user || !initiator)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        const ownermembership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(initiator.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) },
                Type: 'owner'
            } });
        if (!ownermembership)
            throw new common_1.HttpException("The initiator should be an owner for this action to go through", common_1.HttpStatus.FORBIDDEN);
        const updatedmembership = await this.channelMembershipRepository.findOne({ where: { user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) },
                Type: 'admin'
            } });
        if (!updatedmembership)
            throw new common_1.HttpException("The user isn't an admin", common_1.HttpStatus.FORBIDDEN);
        updatedmembership.Type = 'member';
        return await this.channelMembershipRepository.save(updatedmembership);
    }
    async joinChannel(channelID, userID, Pass) {
        console.log("-88888-------> ", userID);
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        console.log("--------> ", user.id);
        const membership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) }
            } });
        if (membership)
            throw new common_1.HttpException("The User is already in the chat", common_1.HttpStatus.FORBIDDEN);
        if (channel.Type == "protected") {
            if (!this.checkPassword(channelID, Pass))
                throw new common_1.HttpException("Password is incorrect", common_1.HttpStatus.FORBIDDEN);
        }
        const newmembership = new channelMembership_entity_1.ChannelMembership();
        newmembership.Userid = user.id;
        newmembership.Channelid = channel.id;
        newmembership.Type = "member";
        return await this.channelMembershipRepository.save(newmembership);
    }
    async LeaveChannel(channelID, userID) {
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        const membership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) }
            } });
        if (!membership)
            throw new common_1.HttpException("The User hasn't joined the channel", common_1.HttpStatus.FORBIDDEN);
        if (membership.Type == "owner") {
            const adminmem = await this.channelMembershipRepository.findOne({
                where: { Type: 'admin', Channelid: (0, typeorm_3.Equal)(channel.id) },
            });
            adminmem.Type = "owner";
            await this.channelMembershipRepository.save(adminmem);
        }
        await this.channelMembershipRepository.delete(membership.id.valueOf());
        return true;
    }
    async muteUser(channelID, userID, amount) {
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        const user2 = await this.channelMembershipRepository.findOne({ where: { Userid: (0, typeorm_3.Equal)(userID), Type: 'member' } });
        if (user2)
            throw new common_1.HttpException("This User doesn't have the rights to perform this action", common_1.HttpStatus.FORBIDDEN);
        const membership = await this.channelMembershipRepository.findOne({
            where: [
                {
                    user: { id: (0, typeorm_3.Equal)(user.id) },
                    channel: { id: (0, typeorm_3.Equal)(channel.id) },
                    isMuted: true,
                },
                {
                    user: { id: (0, typeorm_3.Equal)(user.id) },
                    channel: { id: (0, typeorm_3.Equal)(channel.id) },
                    isBanned: true,
                },
            ],
        });
        if (membership)
            throw new common_1.HttpException("The User might already be Muted/Banned", common_1.HttpStatus.FORBIDDEN);
        const normalmembership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) }, isMuted: false
            } });
        normalmembership.isMuted = true;
        normalmembership.muteEndDate = new Date();
        normalmembership.muteEndDate.setMinutes(normalmembership.muteEndDate.getMinutes() + amount);
        return this.channelMembershipRepository.save(normalmembership);
    }
    async banUser(channelID, userID, amount) {
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        const user2 = await this.channelMembershipRepository.findOne({ where: { Userid: (0, typeorm_3.Equal)(userID), Type: 'member' } });
        if (user2)
            throw new common_1.HttpException("This User doesn't have the rights to perform this action", common_1.HttpStatus.FORBIDDEN);
        const membership = await this.channelMembershipRepository.findOne({
            where: [
                {
                    user: { id: (0, typeorm_3.Equal)(user.id) },
                    channel: { id: (0, typeorm_3.Equal)(channel.id) },
                    isMuted: true,
                },
                {
                    user: { id: (0, typeorm_3.Equal)(user.id) },
                    channel: { id: (0, typeorm_3.Equal)(channel.id) },
                    isBanned: true,
                },
            ],
        });
        if (membership)
            throw new common_1.HttpException("The User might already be Muted/Banned", common_1.HttpStatus.FORBIDDEN);
        const normalmembership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(user.id) },
                channel: { id: (0, typeorm_3.Equal)(channel.id) }, isBanned: false
            } });
        normalmembership.isBanned = true;
        normalmembership.banEndDate = new Date();
        normalmembership.banEndDate.setMinutes(normalmembership.muteEndDate.getMinutes() + amount);
        return this.channelMembershipRepository.save(normalmembership);
    }
    async unmuteUser(channelID, userID) {
        const channel = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        const user = await this.userRepository.findOne({ where: { id: (0, typeorm_3.Equal)(userID) } });
        if (!channel || !user)
            throw new common_1.HttpException("Channel or User not found", common_1.HttpStatus.FORBIDDEN);
        const ismuted = await this.channelMembershipRepository.findOne({ where: { user: { id: (0, typeorm_3.Equal)(userID) },
                channel: { id: (0, typeorm_3.Equal)(channelID) },
                isMuted: true } });
        if (!ismuted)
            throw new common_1.HttpException("This User isn't muted", common_1.HttpStatus.FORBIDDEN);
        const membership = await this.channelMembershipRepository.findOne({ where: {
                user: { id: (0, typeorm_3.Equal)(userID) },
                channel: { id: (0, typeorm_3.Equal)(channelID) },
                isMuted: true
            } });
        membership.isMuted = false;
        return await this.channelMembershipRepository.save(membership);
    }
    async getAllChannels() {
        return this.channelRepository.find({
            where: {
                Type: (0, typeorm_2.Not)("private")
            },
        });
    }
    async getChannel(channelID) {
        return this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
    }
    async checkPassword(channelID, password) {
        if (!password)
            return false;
        const pass = await this.channelRepository.findOne({ where: { id: (0, typeorm_3.Equal)(channelID) } });
        return bcrypt.compare(password, pass);
    }
    async hashPassword(password) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(channelMembership_entity_1.ChannelMembership)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChannelService);
//# sourceMappingURL=channel.service.js.map