import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
export declare class ProfileService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findByName(username: any): Promise<User | null>;
}
