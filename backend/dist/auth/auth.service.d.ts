import { UserDto } from 'src/Dto/use.Dto';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { JWToken } from './jwt.service';
export declare class AuthService {
    private readonly userservice;
    private readonly jwtoken;
    constructor(userservice: UserService, jwtoken: JWToken);
    check_and_create(body: UserDto): Promise<String | boolean | User>;
    validate_by_username(username: String, password: String): Promise<User | null>;
    create_Oauth(body: UserDto): Promise<boolean | User>;
    generateToken_2(user: Partial<User>): Promise<String>;
    isValid(token: String): Promise<boolean>;
}
