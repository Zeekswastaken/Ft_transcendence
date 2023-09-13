// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';

let i = 0;

interface Player {
  isLeft: boolean;
  data: User;
  y: number;
  score: number
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  vX: number;
  vY: number;
}

interface BallCoordinates {
  x: number;
  y: number;
}

interface BallBoundary {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface PlayerBoundary {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface GameData {
  player1: Player;
  player2: Player;
  ball:    Ball;
}

function radiansRange (degrees: number)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function mapRange (value: number, a: number, b: number, c: number, d: number) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

const  collision = (ball: Ball, player: Player) => {
  let b: BallBoundary = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  let p: PlayerBoundary = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  b.top = ball.y - ball.radius;
  b.bottom = ball.y + ball.radius;
  b.left = ball.x - ball.radius;
  b.right = ball.x + ball.radius;
  
  p.top = player.y;
  p.bottom = player.y + 25;
  if(player.isLeft)
  {
    p.left = 0.5;
    p.right = 2.5;
  } else {
    p.left = 97.5;
    p.right =  97.5 + 2;
  }

  return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom );
}

const update = (ball: Ball, player1: Player, player2: Player) => {
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
      ball.speed += 0.1;
  }

  if(ball.x - ball.radius < 0) {
      player2.score++;
      ball.x = 50;
      ball.y = 50;
      ball.radius = 3;
      ball.speed = 1;
      ball.vX = .1;
      ball.vY = .1;
  } else  if(ball.x + ball.radius > 100){
      player1.score++;
      ball.x = 50;
      ball.y = 50;
      ball.radius = 3;
      ball.speed = 1;
      ball.vX = .1;
      ball.vY = .1;
  }
}


@Injectable()
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  GamesData: Map<string, GameData> = new Map();
  @WebSocketServer()
  server: Server;
  constructor (private readonly jwt:JWToken,private readonly userservice:UserService){}
  async handleConnection(client: Socket) {
  }

  @SubscribeMessage('setSocket')
  async getSocketGame(client: Socket,obj:{token:string}) {
    if (await this.jwt.verify(obj.token))
    {
      const user = await this.jwt.decoded(obj.token);
      user.PlayerSocket = client.id;
      await this.userservice.update(user,user.id as number);
      // const oponnent = await this.userservice.findByName(obj.username);
      // client.emit("getOpponent", oponnent);
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
    i++;
    if(i % 2 == 0)
    {
        await this.connectPlayers({p1Name: "Hamza", p2Name: "Zakaria"});
    }
  }

  @SubscribeMessage('connectPlayers')
  async connectPlayers(obj:{p1Name: string, p2Name: string}) {
    const player1 = await this.userservice.findByName("Hamza");
    const player2 = await this.userservice.findByName("Zakaria");
    const initGameData = { 
      player1: {isLeft: true, data: player1, y: 300, score: 0}, 
      player2: {isLeft: false, data: player2, y: 300, score: 0}, 
      ball: {x: 50, y: 50, radius: 3, speed: 1, vX: 0.1, vY: 0.1}
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
        update(gameData.ball, gameData.player1, gameData.player2);
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
      // console.log("User : " + obj.user.username + " Pos : " + obj.pos + " id = " + obj.id);
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
