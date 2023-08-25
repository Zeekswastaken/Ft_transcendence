import { ChannelMembership } from './channelMembership.entity';
export declare class Message {
    id: number;
    text: string;
    Created_at: Date;
    membership: ChannelMembership;
}
