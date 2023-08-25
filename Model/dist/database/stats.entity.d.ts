import { User } from './user.entity';
import { Achievements } from "./achievements.entity";
export declare class Stats {
    id: Number;
    matches_played: Number;
    wins: Number;
    losses: Number;
    level: Number;
    winrate: Number;
    user: User;
    achievements: Achievements[];
}
