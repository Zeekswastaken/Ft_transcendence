import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { Stats } from '../database/stats.entity';
import { Match } from '../database/match.entity';
import { GameInvite } from '../database/gameInvite.entity';
import { BlockedUser } from '../database/blockedUser.entity';
import { UserFriends } from '../database/userFriends.entity';
import { Achievements } from '../database/achievements.entity';
import { Notification } from "../database/notifications.entity";
import { Message } from "../database/message.entity";
import { Channel } from "../database/channel.entity";
import { User } from "../database/user.entity";
import { ChannelMembership } from "../database/channelMembership.entity";

const config = {
    type: 'postgres',
    host: '10.14.3.7', // Use the service name defined in your Docker Compose file
    port: 5432,
    username: 'admin',
    password: 'pass',
    database: 'mydb',
    entities: [Message, Channel, User, ChannelMembership, Stats, Match, GameInvite, BlockedUser, UserFriends, Achievements, Notification],
    logging: false,
    synchronize: true,
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);