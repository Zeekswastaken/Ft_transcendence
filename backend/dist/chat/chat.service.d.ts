import { ChannelMembership } from 'src/database/channelMembership.entity';
import { Message } from 'src/database/message.entity';
import { Repository } from 'typeorm';
export declare class ChatService {
    private readonly ChannelMRepo;
    private readonly msg;
    constructor(ChannelMRepo: Repository<ChannelMembership>, msg: Repository<Message>);
    getAllRooms(Userid: number): Promise<string[]>;
    isMatched(Name: string, Userid: number): Promise<boolean>;
    saveMsg(text: Partial<Message>): Promise<void>;
}
