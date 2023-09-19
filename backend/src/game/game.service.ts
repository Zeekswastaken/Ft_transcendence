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
    async save(Body: any) {
        const Player1 = await this.userservice.findById(Body.player1.id);
        const Player2 = await this.userservice.findById(Body.player2.id);
        const match = new Match();
        match.player1 = Body.player1;
        match.player2 = Body.player2;
        match.player1Score = Body.player1Score;
        match.player2Score = Body.player2Score;
        match.result = Body.result;
        const savedMatch = await this.MatchRepo.save(match);
        Player1.stats.matches.push(savedMatch);
        Player2.stats.matches.push(savedMatch);
        
        let User1a, User2a, User1, User2;
        User1a = await this.userservice.save(Player1);
        User2a = await this.userservice.save(Player2);
        if (match.result === Body.player1.id) {
            User1 = await this.updateWinner(User1a);
            User2 = await this.updateLoser(User2a);
        } else {
            User1 = await this.updateLoser(User1a);
            User2 = await this.updateWinner(User2a);
        }
    
        console.log("USER1 AFTER GAME=======", User1.stats);
    }

    async updateWinner(user:User)
    {
        user.stats.wins++;
        user.stats.matches_played++;
        user.stats.level += 0.25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        await this.statsRepo.save(user.stats);
        console.log("LETS SEEE ======= ", user.stats.matches);
        return await this.userservice.save(user);
    }

    async updateLoser(user:User)
    {
        user.stats.losses++;
        user.stats.matches_played++;
        user.stats.level += 0.25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        await this.statsRepo.save(user.stats);
        return (await this.userservice.save(user));
    }
}