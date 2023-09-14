// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { Ball, Player, BallBoundary, PlayerBoundary, GameData, BallCoordinates } from './gameInterfaces';
import { collision, radiansRange, mapRange, initBall } from './helper';
let i = 0;

@Injectable()
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  GamesData: Map<string, GameData> = new Map();
  @WebSocketServer()
  server: Server;
  constructor (private readonly jwt:JWToken,private readonly userservice:UserService){}
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
    if(ball.y + ball.radius > 100 || ball.y - ball.radius < 0){
      ball.vY = -ball.vY;
    }
    let selectPlayer = ball.x < 100 / 2 ? player1 : player2;
    if(collision(ball, selectPlayer))
    {
        if(selectPlayer == player1)
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, 25, -rad, rad);
            ball.vX = 0.5 * Math.cos(angle);
            ball.vY = 0.5 * Math.sin(angle);
        }
        else
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, 25, -rad, rad);
            ball.vX = (0.5 * Math.cos(angle)) * -1; 
            ball.vY = (0.5 * Math.sin(angle)); 
        }
        ball.speed += 0.1 ;
    }
  
    if(ball.x - ball.radius < 0) {
      player2.score++;
      this.updateScore(player1, player2);
      initBall(ball);
    } else  if(ball.x + ball.radius > 100){
        player1.score++;
        this.updateScore(player1, player2);
        initBall(ball);
    }
  }

  @SubscribeMessage('setSocket')
  async getSocketGame(client: Socket,obj:{token:string}) {
    if (await this.jwt.verify(obj.token))
    {
      const user = await this.jwt.decoded(obj.token);
      user.PlayerSocket = client.id;
      await this.userservice.update(user,user.id as number);
      await this.startGame();
    }
  }

  handleDisconnect(client: Socket) 
  { 
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('startGame')
  async startGame() {
        await this.connectPlayers({p1Name: "Hamza", p2Name: "Zakaria"});
  }

  @SubscribeMessage('connectPlayers')
  async connectPlayers(obj:{p1Name: string, p2Name: string}) {
    const player1 = await this.userservice.findByName(obj.p1Name);
    const player2 = await this.userservice.findByName(obj.p2Name);
    const initGameData = { 
      player1: {isLeft: true,  isReady: false, data: player1, y: 50, score: 0}, 
      player2: {isLeft: false, isReady: false,  data: player2, y: 50, score: 0}, 
      ball: {x: 50, y: 50, radius: 3, speed: 5, vX: 0.1, vY: 0.1}
    };
    const id: string = player1.username.toString() + player2.username.toString();
    this.GamesData.set(id, initGameData);
    this.server.to(player1.PlayerSocket as string).emit("getGameData", player2, id);
    this.server.to(player2.PlayerSocket as string).emit("getGameData", player1, id);
  }

  @SubscribeMessage('getBallAndP2Positions')
  async getBallAndP2Positions(client: Socket, obj:{id: string, user: User}) {
    const gameData: GameData | undefined = this.GamesData.get(obj.id);
    let ball: BallCoordinates = {
      x: 50,
      y: 50
    }
    if(gameData)
    {
      if(gameData.player1.data.username === obj.user.username)
      {
        this.update(gameData.ball, gameData.player1, gameData.player2);
        ball.x = gameData.ball.x;
        ball.y = gameData.ball.y;
        client.emit("getBallOpponentPostion", gameData.player2.y, ball);
      }
      else
      {
        ball.x = 100 - gameData.ball.x;
        ball.y = gameData.ball.y;
        client.emit("getBallOpponentPostion", gameData.player1.y, ball);
      }
    }
  }

  @SubscribeMessage('setPositon')
  async setPosition(client: Socket, obj:{id: string, user: User, pos: number}) {
    const gameData: GameData | undefined = this.GamesData.get(obj.id);
    if(gameData)
    {
      if(gameData.player1.data.username == obj.user.username)
      {
        this.GamesData.get(obj.id).player1.y = obj.pos;
      }
      else
      {
        this.GamesData.get(obj.id).player2.y = obj.pos;
      }
    }
  }
}
