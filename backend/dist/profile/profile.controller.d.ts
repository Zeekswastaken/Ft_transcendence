import { User } from 'src/database/user.entity';
import { JWToken } from 'src/auth/jwt.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';
import { FriendsService } from 'src/friends/friends.service';
import { BlockedService } from 'src/blocked/blocked.service';
export declare class ProfileController {
    private readonly userservice;
    private readonly profileService;
    private readonly friendsService;
    private readonly jwt;
    private readonly blockedService;
    constructor(userservice: UserService, profileService: ProfileService, friendsService: FriendsService, jwt: JWToken, blockedService: BlockedService);
    display(username: String, res: any): Promise<void>;
    update(Body: Partial<User>, res: any, id: number): Promise<void>;
}
