import { User } from './user.entity';
export declare class BlockedUser {
    id: number;
    blockedby: User;
    blockeduser: User;
    setBlockedRelationship(blockedBy: User, blockedUser: User): void;
}
