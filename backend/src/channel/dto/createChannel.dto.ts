import { Channel } from "../../database/channel.entity";
import { IsNotEmpty, IsString, IsOptional} from 'class-validator'
export class createChannelDto extends Channel{
    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    type: String;

    @IsOptional()
    @IsString()
    password?: String;

}
