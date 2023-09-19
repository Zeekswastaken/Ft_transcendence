import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/database/match.entity';
import { Stats } from 'src/database/stats.entity';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
    constructor(@InjectRepository(Stats) private readonly statsRepo: Repository<Stats>,@InjectRepository(Match) private readonly MatchRepo: Repository<Match>,private readonly userservice:UserService){}
    async save(Body:any){
        const match = new Match();
        this.MatchRepo.create(match);
        match.player1 = Body.player1;
        match.player2 = Body.player2;
        match.player1Score = Body.player1Score;
        match.player2Score = Body.player2Score;
        match.result = Body.result;
        match.Date = new Date();
        await this.MatchRepo.save(Body);
        Body.player1.stats.matches.push(match);
        Body.player2.stats.matches.push(match);
        if (match.result === Body.player1.id)
        {
            await this.updateWinner(Body.player1);
            await this.updateLoser(Body.player2);
        }
        else
        {
            await this.updateLoser(Body.player1);
            await this.updateWinner(Body.player2);
        }
        await this.userservice.save(Body.player1);
        await this.userservice.save(Body.player2);
    }

    async updateWinner(user:User)
    {
        user.stats.wins++;
        user.stats.matches_played++;
        user.stats.level += 0.25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        await this.userservice.save(user);
    }

    async updateLoser(user:User)
    {
        user.stats.losses++;
        user.stats.matches_played++;
        // user.stats.level += 0.25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        await this.userservice.save(user);
    }
}
