import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameInvite } from 'src/database/gameInvite.entity';
import { Match } from 'src/database/match.entity';
import { Stats } from 'src/database/stats.entity';
import { User } from 'src/database/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';
import { Equal, Repository, SelectQueryBuilder, Not } from 'typeorm';

@Injectable()
export class GameService {
    constructor(@InjectRepository(Stats) private readonly statsRepo: Repository<Stats>,@InjectRepository(Match) private readonly MatchRepo: Repository<Match>,private readonly userservice:UserService, @InjectRepository(GameInvite) private readonly GameinviteRepo: Repository<GameInvite>, private readonly notifService: NotificationsService){}
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
        Player2.stats.matches.push(savedMatch);
        let User1a, User2a, User1, User2;
        Player2.status = 'online';
        // delete Player2.status;
        User2a = await this.userservice.save(Player2);
        // console.log("Before push: ", Player1.stats.matches);
        Player1.stats.matches.push(savedMatch);
        // console.log("After push: ", Player1.stats.matches);
        // Player1.stats.matches.push( savedMatch);
        Player1.status = 'online';
        // delete Player1.status;
        User1a = await this.userservice.save(Player1);
        if (match.result === Body.player1.id) {
            User1 = await this.updateWinner(User1a);
            User2 = await this.updateLoser(User2a);
        } else {
            User1 = await this.updateLoser(User1a);
            User2 = await this.updateWinner(User2a);
        }
    
        // console.log("USER1 AFTER GAME=======", User1.stats);
    }

    async getGameInvites(userid:any): Promise<Match[]>
    {
        const user = await this.userservice.findById(userid);
        if (!user)
            throw new HttpException("User not found", HttpStatus.FORBIDDEN);
            const player1Matches = await this.MatchRepo.find({ where: { player1: Equal(user.id) }, relations:['player1', 'player2'] });
            const player2Matches = await this.MatchRepo.find({ where: { player2: Equal(user.id) }, relations:['player1', 'player2'] });
            
            const matches = [...player1Matches, ...player2Matches];
            matches.sort((match1, match2) => (match2.id as number) - (match1.id as number));

        return matches;
    }

    async updateWinner(user:User)
    {
        user.stats.wins++;
        user.stats.matches_played++;
        user.stats.level += 0.25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        user.stats.score += 50;
        await this.statsRepo.save(user.stats);
        // console.log("LETS SEEE ======= ", user.stats.matches);
        return await this.userservice.save(user);
    }

    async updateLoser(user:User)
    {
        user.stats.losses++;
        user.stats.matches_played++;
        if (user.stats.score > 0)
          user.stats.score -= 25;
        user.stats.winrate = (user.stats.wins/user.stats.matches_played)*100;
        await this.statsRepo.save(user.stats);
        return (await this.userservice.save(user));
    }

    async addToQueue(userid: Number)
    {
      var entrance = 0;
      const User = await this.userservice.findById(userid);
      if (!User)
        throw new HttpException("User not found", HttpStatus.FORBIDDEN);
      User.PlayerSocket = null;
      // console.log("**********************************************************************************,",User.Socket,"**********************************************************");
      delete User.Socket;
      const user = await this.userservice.save(User); 
      const queue = await this.GameinviteRepo.findOne({where:{receiver: null, type: 'random'}});
      while(entrance != 0){}
      if (!queue)
      {
        entrance++;
        const game = new GameInvite();
        game.sender = user;
        game.type = 'random';
        entrance--;
        return await this.GameinviteRepo.save(game);
      }
      else
      {
        const check = await this.GameinviteRepo.findOne({where:{sender: Equal(userid),receiver: null, type: 'random'}});
        if (check)
            return ;
        entrance++;
        queue.receiver = user;
        entrance--;
        return await this.GameinviteRepo.save(queue);
      }
    }

    async addToGroupQueue(userid: Number, receiverid:Number)
    {
      const User = await this.userservice.findById(userid);
      const receiver = await this.userservice.findById(receiverid);
      if (!User || !receiver)
        throw new HttpException("User not found", HttpStatus.FORBIDDEN);
      User.PlayerSocket = null;
      // console.log("**********************************************************************************,",User.Socket,"**********************************************************");
      delete User.Socket;
      const user = await this.userservice.save(User); 
      const queue = await this.GameinviteRepo.findOne({where:[{sender:Equal(userid), receiver: Equal(receiverid), type: 'invite'},{sender:Equal(receiverid), receiver: Equal(userid), type: 'invite'}]});
      if (!queue)
      {
        const game = new GameInvite();
        game.sender = user;
        game.receiver = receiver;
        game.type = 'invite';
        game.status = 'pending';
        return await this.GameinviteRepo.save(game);
      }
      else
        throw new HttpException("Queue already exists", HttpStatus.FORBIDDEN);
    }
    async acceptInvite(userid:Number, senderid:Number)
    {
      const User = await this.userservice.findById(userid);
      const sender = await this.userservice.findById(senderid);
      if (!User || !sender)
        throw new HttpException("User not found", HttpStatus.FORBIDDEN);
        const queue = await this.GameinviteRepo.findOne({where:{sender:Equal(senderid), receiver: Equal(userid), type: 'invite', status:'pending'}});
        if (!queue)
          throw new HttpException("Queue not found", HttpStatus.FORBIDDEN);
        queue.status = 'accepted'
        await this.notifService.deleteNotif(queue.sender, queue.receiver ,"Game invite");
        return await this.GameinviteRepo.save(queue);
    }

    async acceptQueue(inviteid:Number, userid:Number)
    {
      const User = await this.userservice.findById(userid);
      if (!User)
        throw new HttpException("User not found", HttpStatus.FORBIDDEN);
        User.PlayerSocket = null;
        const user = await this.userservice.save(User); 
        const queue = await this.GameinviteRepo.findOne({where:{sender: Equal(userid),receiver: null, type: 'invite'}});
        
        if (queue)
        {
          queue.receiver = user;
          queue.status = 'accepted'
          return await this.GameinviteRepo.save(queue);
        }
    }

    async DeleteQueue(queueid:Number)
    {
        const queue = await this.GameinviteRepo.findOne({where:{id:Equal(queueid)}, relations:['sender', 'receiver']});
        if (queue)
        {
          if (queue.type === 'invite')
            await this.notifService.deleteNotif(queue.sender, queue.receiver, 'Game invite')
          await this.GameinviteRepo.delete(queue.id as number);
        }
        }

    async findQueue(userid:Number)
    {
        const queue =  await this.GameinviteRepo.findOne({where: {sender: Equal(userid)}});
        // console.log("QUEUUUUE IN HEEEERE --- ", queue);
        return queue;
    }

    async getUsersForLeaderboard(userid:Number) : Promise<{Topthree:User[] ,Rest:User[], User:User, Pos:number}>
    {
      if (userid)
      {
      const user = await this.userservice.findById(userid);
      const users = await this.userservice.findAll();
      // console.log("CURRENT USERS ======== ",user, "OTHER USERRS ======= ", users);
      if (!users || !user)
          throw new HttpException("Users not found", HttpStatus.NOT_FOUND);
      users.sort((a,b) => b.stats.score - a.stats.score);
      const ind = users.findIndex(User => User.id === user.id);
      const topThreeUsers = users.slice(0, 3);
      const Rest = users.slice(3,10);
      return {Topthree:topThreeUsers, Rest:Rest, User:user, Pos:ind+1};
      }
      return null;
    }
}