import { ChannelMembership } from './channelMembership.entity';
export declare class Channel {
    id: Number;
    Name: string;
    Type: String;
    Password: String;
    memberships: ChannelMembership[];
}
