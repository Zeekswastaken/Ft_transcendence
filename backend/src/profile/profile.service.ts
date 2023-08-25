import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
    async findByName(username:any): Promise<User| null>
    {
        if (await  this.userRepo.findOne({where :{ username: username}}) != null)
        {
            console.log(await  this.userRepo.findOne({where :{ username: username}}));
            const user =  await this.userRepo.findOne({where :{ username: username},relations:['stats']});
            return user;
        }
    }
}
