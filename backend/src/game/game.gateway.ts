import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket,OnGatewayDisconnect,MessageBody ,OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { Ball, Player, GameData, BallCoordinates } from './gameInterfaces';
import { collision, radiansRange, mapRange, initBall } from './helper';
import { GameService } from './game.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Match } from 'src/database/match.entity';
import { Equal, Repository } from 'typeorm';

const WinnerScore = 7;
const LoserScore = 0;

@Injectable()
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  GamesData: Map<string, GameData> = new Map();
  users: Map<string, string> = new Map();
  ready : Array<User> = new Array();
  @WebSocketServer()
  server: Server;
  constructor (private readonly jwt:JWToken,private readonly userservice:UserService, private readonly gameservice:GameService, private readonly notifService:NotificationsService){}
  async handleConnection(client: Socket) {
  }

  updateScore = (player1: Player, player2: Player) => {
    this.server.to(player1.data.PlayerSocket as string).emit("updateScoore", player1.score, player2.score);
    this.server.to(player2.data.PlayerSocket as string).emit("updateScoore", player2.score, player1.score);
  }

   update = (ball: Ball, player1: Player, player2: Player) => {
    ball.x += ball.vX * ball.speed;
    ball.y += ball.vY * ball.speed;
    var rad = radiansRange(45);
    if(ball.y + (ball.radius / 2) >= 100 || ball.y - (ball.radius / 2) <= 0){
      if(ball.y + ball.radius >= 100) {
        ball.y = 100 - ball.radius;
      } else {
        ball.y = ball.radius;
      }
      ball.vY = -ball.vY;
    }
    let selectPlayer = ball.x < 100 / 2 ? player1 : player2;
    if(collision(ball, selectPlayer))
    {
        if(selectPlayer == player1)
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, 25, -rad, rad);
            ball.vX = 0.75 * Math.cos(angle);
            ball.vY = 0.75 * Math.sin(angle);
        }
        else
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, 25, -rad, rad);
            ball.vX = (0.75 * Math.cos(angle)) * -1; 
            ball.vY = (0.75 * Math.sin(angle)); 
        }
        ball.speed += ball.deltaSpeed;
    }
  
    if(ball.x < 0) {
      player2.score++;
      this.updateScore(player1, player2);
      initBall(ball);
    } else  if(ball.x > 100){
        player1.score++;
        this.updateScore(player1, player2);
        initBall(ball);
    }
  }

  checkScore = async (id: string ,player1: Player, player2: Player) => {
    if((player2.score == 7 && player1.score == 0 ) || 
      (player2.score == 0 && player1.score == 7)   || 
      (player2.score == 9 && player1.score <= 2)   || 
      (player2.score <= 2 && player1.score == 9)   || 
       player2.score == 12 || player1.score == 12 ) {
        this.server.to(player1.data.PlayerSocket as string).emit("gameOver");
        this.server.to(player2.data.PlayerSocket as string).emit("gameOver");
        if(player1.score > player2.score) {
          this.server.to(player1.data.PlayerSocket as string).emit("celebrate");
          this.gameservice.save({player1:player1.data, player2: player2.data, player1Score: player1.score, player2Score: player2.score, result: player1.data.id});
          const user = await this.userservice.findById(player1.data.id);
          const user2 = await this.userservice.findById(player2.data.id);
        } else {
          this.server.to(player2.data.PlayerSocket as string).emit("celebrate");
          await this.gameservice.save({player1:player1.data, player2: player2.data, player1Score: player1.score, player2Score: player2.score, result: player2.data.id});
        }
        
        this.GamesData.delete(id);
        this.users.delete(player1.data.PlayerSocket as string);
        this.users.delete(player2.data.PlayerSocket as string);
    }
  }

  @SubscribeMessage('setSocket')
  async getSocketGame(client: Socket,obj:{token:string}) {
    if (await this.jwt.verify(obj.token))
    {
      const decode = await this.jwt.decoded(obj.token);
      const user =  await this.userservice.findById(decode.id);
      user.PlayerSocket = client.id;
      delete user.Socket;
      await this.userservice.update(user,user.id as number);
    }
  }



  handleDisconnect(client: Socket) 
  {
    const id = this.users.get(client.id);
    if(id !== undefined) {
      const gameData = this.GamesData.get(id);
      if(gameData !== undefined)
      {
        if(gameData.player1.data.PlayerSocket == client.id) {
          this.server.to(gameData.player2.data.PlayerSocket as string).emit("updateScoore", WinnerScore, LoserScore);
          this.server.to(gameData.player2.data.PlayerSocket as string).emit("gameOver");
          this.server.to(gameData.player2.data.PlayerSocket as string).emit("celebrate");
          this.gameservice.save({player1: gameData.player1.data, player2: gameData.player2.data, player1Score: LoserScore, player2Score: WinnerScore, result: gameData.player2.data.id});
        } else {
          this.server.to(gameData.player1.data.PlayerSocket as string).emit("updateScoore", WinnerScore, LoserScore);
          this.server.to(gameData.player1.data.PlayerSocket as string).emit("gameOver");
          this.server.to(gameData.player1.data.PlayerSocket as string).emit("celebrate");
          this.gameservice.save({player1:gameData.player1.data, player2: gameData.player2.data, player1Score: WinnerScore, player2Score: LoserScore, result: gameData.player1.data.id});
        }
        this.GamesData.delete(id);
        this.users.delete(gameData.player1.data.PlayerSocket as string);
        this.users.delete(gameData.player2.data.PlayerSocket as string)
      }
    }
  }

  
  @SubscribeMessage('Disconnect')
  async disconnect(client: Socket) {
    this.handleDisconnect(client);
  }
  

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('connectPlayers')
  async connectPlayers(obj:{p1: string, p2: string}) {
    
    if(obj.p1 !== undefined && obj.p2 !== undefined) {
      let player1: User = await this.userservice.findByName(obj.p1);
      let player2: User = await this.userservice.findByName(obj.p2);
      while(player1.PlayerSocket == null || player2.PlayerSocket == null)
      {
        player1 = await this.userservice.findByName(obj.p1);
        player2 = await this.userservice.findByName(obj.p2);
      }
      
      const initGameData = { 
        player1: {isLeft: true,  isReady: false, data: player1, y: 50 - 25 / 2, score: 0,}, 
        player2: {isLeft: false, isReady: false,  data: player2, y: 50 - 25 / 2, score: 0}, 
        ball: {x: 50, y: 50, radius: 3, speed: 1, vX: 0.5, vY: 0.5, direction: 1, deltaSpeed: 0.2}
      };
      const id: string = player1.username.toString() + player2.username.toString();
      this.users.set(player1.PlayerSocket as string, id);
      this.users.set(player2.PlayerSocket as string, id);
      this.GamesData.set(id, initGameData);
      player1.status = 'inGame';
      player2.status = 'inGame';
      await this.userservice.update(player1,player1.id as number);
      await this.userservice.update(player2,player2.id as number);
      this.server.to(player1.PlayerSocket as string).emit("getGameData", player2, id);
      this.server.to(player2.PlayerSocket as string).emit("getGameData", player1, id);
    }
  }

  @SubscribeMessage('getBallAndP2Positions')
  async getBallAndP2Positions(client: Socket, obj:{id: string, user: User}) {
    const gameData: GameData | undefined = this.GamesData.get(obj.id);
    if(gameData)
    {
      if(gameData.player1.data.username === obj.user.username) {
        this.update(gameData.ball, gameData.player1, gameData.player2);
        await this.checkScore(obj.id, gameData.player1, gameData.player2);
        client.emit("getBallOpponentPostion", gameData.player2.y, {x: gameData.ball.x, y: gameData.ball.y});
      }
      else {
        client.emit("getBallOpponentPostion", gameData.player1.y, {x: 100 - gameData.ball.x, y: gameData.ball.y});
      }
    }
  }

  @SubscribeMessage('setPositon')
  async setPosition(client: Socket, obj:{id: string, user: User, pos: number}) {
    const gameData: GameData | undefined = this.GamesData.get(obj.id);
    if(gameData)
    {
      if(gameData.player1.data.username == obj.user.username) {
        this.GamesData.get(obj.id).player1.y = obj.pos;
      }
      else {
        this.GamesData.get(obj.id).player2.y = obj.pos;
      }
    }
  }

  @SubscribeMessage('oneVsBotChangeScore')
  async oneVsBot(client: Socket, obj:{player: number, bot: number}) {
    client.emit("changeScore", obj.player, obj.bot);
    if((obj.player == 7 && obj.bot == 0 ) || 
        (obj.player == 0 && obj.bot == 7) || 
        (obj.player == 9 && obj.bot <= 2) || 
        (obj.player <= 2 && obj.bot == 9) || 
        obj.player == 12 || obj.bot == 12 ) {
          client.emit("gameOver", obj.player, obj.bot);
          if(obj.player > obj.bot) {
            client.emit("celebrate");
          }
    }
  }

  @SubscribeMessage('SendInviteNotif')
  async send(@MessageBody() data: {userid:Number , recipientid:Number}, @ConnectedSocket() client: Socket)
  {
    const recipient = await this.userservice.findById(data.recipientid);
    if (!recipient)
      throw new HttpException("Recipient not found", HttpStatus.FORBIDDEN);
    await this.notifService.createGameNotification(data.userid, data.recipientid);
    const friendnotif = await this.notifService.getFriendNotifs(data.recipientid);
      const gamenotif = await this.notifService.getGameNotifs(data.recipientid);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      this.server.to(recipient.Socket).emit("friend notif", notif);
      const message = "The gameinvite has been sent";
      this.server.to(recipient.Socket).emit('message', message);
  }

  @SubscribeMessage('AddtoQueue')
  async add(@MessageBody() data: {userid:Number}, @ConnectedSocket() client: Socket)
  {
    if (data.userid != 0) {
      const queue = await this.gameservice.addToQueue(data.userid);

      this.server.to(client.id).emit("queue", queue);
      if (queue.receiver != null)
      {


        this.server.to(queue.sender.Socket).emit("queue", queue);
        let queueData = queue;
        await this.gameservice.DeleteQueue(queue.id);
        await this.connectPlayers({p1: queueData.sender.username as string, p2: queueData.receiver.username as string})
      }
        const message = "The gameinvite has been sent";
    }
  }

  @SubscribeMessage('RemoveQueue')
  async remove(@MessageBody() data: {userid:Number}, @ConnectedSocket() client: Socket)
  {
      const queue = await this.gameservice.findQueue(data.userid);
      if (queue)
      {
        await this.gameservice.DeleteQueue(queue.id);
      }
        this.server.to(client.id).emit("queued", "queuedeleted");

      const message = "The gameinvite has been sent";
      // this.server.to(recipient.Socket).emit('message', message);
  }

  @SubscribeMessage('AddtoInviteQueue')
  async addinvite(@MessageBody() data: {userid:Number, receiver:string}, @ConnectedSocket() client: Socket)
  {
    if (data.userid != 0) {
      const receiver = await this.userservice.findByName(data.receiver);
      const queue = await this.gameservice.addToGroupQueue(data.userid, receiver.id);
      await this.notifService.createGameNotification(data.userid, receiver.id);
      const friendnotif = await this.notifService.getFriendNotifs(receiver.id);
        const gamenotif = await this.notifService.getGameNotifs(receiver.id);
        const notif = {
          "friendRequest": friendnotif,
          "gameInvite": gamenotif
        };
        this.server.to(queue.receiver.Socket).emit("friend notif", notif);
        this.server.to(client.id).emit("pendingqueue", queue);
      }
  }
  
    @SubscribeMessage('AcceptInvite')
    async accept(@MessageBody() data: {userid:Number, receiver:string}, @ConnectedSocket() client: Socket)
    {
      try
      {
      if (data.userid != 0) {
        const receiver = await this.userservice.findByName(data.receiver);
        const queue = await this.gameservice.acceptInvite(data.userid, receiver.id);
        const friendnotif = await this.notifService.getFriendNotifs(receiver.id);
          const gamenotif = await this.notifService.getGameNotifs(receiver.id);
          const notif = {
            "friendRequest": friendnotif,
            "gameInvite": gamenotif,
          };
          this.server.to(client.id).emit("friend notif", notif);
          this.server.to(client.id).emit("acceptedqueue", queue);
          this.server.to(receiver.Socket).emit("acceptedqueue", queue);
          await this.connectPlayers({p1: queue.sender.username as string, p2: queue.receiver.username as string})
          await this.gameservice.DeleteQueue(queue.id);
        }
      }    catch(error)
      {
        console.error('Error accepting invite: ', error.message);
        throw error;  
      }
    }

    @SubscribeMessage('getLeaderboard')
    async getlead(@ConnectedSocket() client: Socket, @MessageBody() data: {userID:Number})
    {
      try{
        const users = await this.gameservice.getUsersForLeaderboard(data.userID);
        this.server.to(client.id).emit("leaderboard", users);
      }    catch(error)
      {
        console.error('Error getting all the users for the leaderboard: ', error.message);
        throw error;  
      }
    }
}
