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
    host: process.env.POSTGRES_HOST, // Use the service name defined in your Docker Compose file
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [Message, Channel, User, ChannelMembership, Stats, Match, GameInvite, BlockedUser, UserFriends, Achievements, Notification],
    logging: false,
    synchronize: true,
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);