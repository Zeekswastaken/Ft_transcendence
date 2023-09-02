import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { Stats } from 'src/database/stats.entity';
export declare class UserService {
    private readonly userRepo;
    private readonly statsRepository;
    constructor(userRepo: Repository<User>, statsRepository: Repository<Stats>);
    compare(password: String, hashedone: String): Promise<Boolean>;
    hashpassword(password: String): Promise<String>;
    save(Body: Partial<User>): Promise<void>;
    findBySocket(socketId: string): Promise<User>;
    update(Body: Partial<User>, id: number): Promise<void>;
    findByName(username: any): Promise<User>;
    findById(id: any): Promise<User>;
    create(User: Partial<User>): Promise<void>;
    saveStat(stat: Partial<Stats>): Promise<void>;
    initStats(user: User): Promise<Stats>;
}
