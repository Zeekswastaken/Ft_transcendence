import { Repository } from 'typeorm';
import { Channel } from '../database/channel.entity';
import { createChannelDto } from './dto/createChannel.dto';
import { ChannelMembership } from '../database/channelMembership.entity';
import { User } from '../database/user.entity';
export declare class ChannelService {
    private readonly channelRepository;
    private readonly channelMembershipRepository;
    private readonly userRepository;
    constructor(channelRepository: Repository<Channel>, channelMembershipRepository: Repository<ChannelMembership>, userRepository: Repository<User>);
    createChannel(createChannelDto: createChannelDto, owner: Number): Promise<Channel>;
    assignAdmin(channelID: Number, userId: Number, initiatorId: Number): Promise<ChannelMembership>;
    removeAdmin(channelID: Number, userID: Number, initiatorID: Number): Promise<ChannelMembership>;
    joinChannel(channelID: Number, userID: Number, Pass: String): Promise<ChannelMembership>;
    LeaveChannel(channelID: Number, userID: Number): Promise<Boolean>;
    muteUser(channelID: Number, userID: Number, amount: number): Promise<ChannelMembership>;
    banUser(channelID: Number, userID: Number, amount: number): Promise<ChannelMembership>;
    unmuteUser(channelID: Number, userID: Number): Promise<ChannelMembership>;
    getAllChannels(): Promise<Channel[]>;
    getChannel(channelID: Number): Promise<Channel>;
    checkPassword(channelID: Number, password: String): Promise<Boolean>;
    hashPassword(password: String): Promise<String>;
}
