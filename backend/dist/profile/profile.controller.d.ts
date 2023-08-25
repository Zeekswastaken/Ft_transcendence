import { User } from 'src/database/user.entity';
import { JWToken } from 'src/auth/jwt.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly userservice;
    private readonly profileService;
    private readonly jwt;
    constructor(userservice: UserService, profileService: ProfileService, jwt: JWToken);
    display(username: String, res: any): Promise<void>;
    update(Body: Partial<User>, res: any, id: number): Promise<void>;
}
