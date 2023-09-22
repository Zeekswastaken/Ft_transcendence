import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
    async findByName(username:any): Promise<User| null>
    {
        if (await  this.userRepo.findOne({where :{ username: username}}) != null)
        {
            // console.log(await  this.userRepo.findOne({where :{ username: username}}));
            const user =  await this.userRepo.findOne({where :{ username: username},relations:['stats', 'stats.matches','stats.matches.player1', 'stats.matches.player2']});
            console.log("ZIS IS ZA USER ====== ", user.stats.matches);
            return user;
        }
    }

}
