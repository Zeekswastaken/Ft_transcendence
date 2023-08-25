import { User } from 'src/database/user.entity';
import { JWToken } from 'src/auth/jwt.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';
import { FriendsService } from 'src/friends/friends.service';
export declare class ProfileController {
    private readonly userservice;
    private readonly profileService;
    private readonly friendsService;
    private readonly jwt;
    constructor(userservice: UserService, profileService: ProfileService, friendsService: FriendsService, jwt: JWToken);
    display(username: String, res: any): Promise<void>;
    update(Body: Partial<User>, res: any, id: number): Promise<void>;
}
