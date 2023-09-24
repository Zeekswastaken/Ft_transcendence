import { TokenExpiredError } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { UserDto ,MoreInfos, TO_update} from '../Dto/use.Dto';
import { Stats } from 'src/database/stats.entity';
import { SocketAddress } from 'net';

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
       return await this.userRepo.save(Body);
    }
    async findBySocket(socketId:string){
        return await this.userRepo.findOne({where:{Socket: socketId}});
    }
    async update(Body:Partial<User>,id:number){
       // console.log("\n\n\n\n\body after == "+ Body);
    //    console.log("id = " + id);
    // Body.privacy = true;
    // else if (Body.privacy == false)
    // Body.privacy = false;
   
            await this.userRepo.update(id,Body);
    }
    async findByName(username:any): Promise<User | null>
    {
       const user =  await this.userRepo.findOne({where :{ username: username},relations:['stats']});
       if (user)
        return user;
        return null;
    }
    async findByEmail(email:any): Promise<User>
    {
       const user =  await this.userRepo.findOne({where :{ email: email},relations:['stats']});
       return user;
    }
    async findById(id:any): Promise<User>
    {
        const user =  await this.userRepo.findOne({where :{ id: id},relations:['stats','stats.matches', 'stats.matches.player1', 'stats.matches.player2']});
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
         stats.score = 0 as number;
         stats.matches_played = 0;
         stats.user = user;
        return await this.statsRepository.save(stats);
    }
    async findAll(): Promise<User[]>
    {
        return await this.userRepo.find({relations:['stats']});
    }
    //async update(Body:UserDto)
    //{
    //    await this.userRepo.update(Body);
    //}
}
