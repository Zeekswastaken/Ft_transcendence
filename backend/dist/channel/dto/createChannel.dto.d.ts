import { Channel } from "../../database/channel.entity";
export declare class createChannelDto extends Channel {
    name: String;
    type: String;
    password?: String;
}
