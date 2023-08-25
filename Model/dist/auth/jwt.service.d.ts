import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/user.entity';
export declare class JWToken {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    private secret_key;
    generateToken_2(user: Partial<User>): Promise<String>;
    verify(token: any): Promise<boolean>;
    decoded(token: any): Promise<null | User>;
}
