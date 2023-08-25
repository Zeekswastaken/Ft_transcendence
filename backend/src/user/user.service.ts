import { TokenExpiredError } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { UserDto ,MoreInfos, TO_update} from '../Dto/use.Dto';
import { Stats } from 'src/database/stats.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats> ) {}
    async compare(password:String,hashedone:String):Promise<Boolean>
    {
        return await bcrypt.compare(password,hashedone);
    }
    async hashpassword(password:String):Promise<String>{
        const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);

    }
    async save(Body:Partial<User> ){
        await this.userRepo.save(Body);
    }
    async update(Body:Partial<User>,id:number){
       // console.log("\n\n\n\n\body after == "+ Body);
       console.log("id = " + id);
            await this.userRepo.update(id,Body);
    }
    async findByName(username:any): Promise<User>
    {
       const user =  await this.userRepo.findOne({where :{ username: username},relations:['stats']});
       return user;
    }
    async findById(id:any): Promise<User>
    {
       const user =  await this.userRepo.findOne({where :{ id: id}});
       return user;
    }
    async create(User:Partial<User>)
    {
         await this.userRepo.create(User);
    }
    
    async saveStat(stat:Partial<Stats> ){
      await this.statsRepository.save(stat);
  }
   //  async findByUseriD(userId:any): Promise<Stats>
   //  {
   //     const stats =  await this.statsRepository.findOne({where :{ userId: userId}});
   //     return stats;
   //  }
    async initStats(user: User): Promise<Stats>{
         const stats = new Stats();
         stats.winrate = 0;
         stats.wins = 0;
         stats.losses = 0;
         stats.level = 0;
         stats.matches_played = 0;
         stats.user = user;
        return await this.statsRepository.save(stats);
    }
    //async update(Body:UserDto)
    //{
    //    await this.userRepo.update(Body);
    //}
}
