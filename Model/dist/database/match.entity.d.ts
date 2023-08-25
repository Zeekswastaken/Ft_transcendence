import { User } from './user.entity';
export declare class Match {
    id: Number;
    player1: User;
    player2: User;
    player1Score: number;
    player2Score: number;
    result: String;
    Date: Date;
}
