// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { setTimeout } from 'timers';
import { sleep } from './helper';
import { copyFileSync } from 'fs';

let i = 0;
interface Player {
  data: User;
  y: number;
  score: number
}
interface GameData {
  player1: Player;
  player2: Player;
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
    const initGameData = {player1: {data: player1, y: 300, score: 0}, player2: {data: player2, y: 300, score: 0}};
    const id: string = player1.username.toString() + player2.username.toString();
    this.GamesData.set(id, initGameData);
    this.server.to(player1.PlayerSocket as string).emit("getGameData", player2, id);
    this.server.to(player2.PlayerSocket as string).emit("getGameData", player1, id);
  }

  @SubscribeMessage('getBallAndP2Positions')
  async getBallAndP2Positions(client: Socket, obj:{id: string, user: User}) {
    const gameData: GameData | undefined = this.GamesData.get(obj.id);
    if(gameData)
    {
      if(gameData.player1.data.username === obj.user.username)
      {
        // console.log(gameData.player2.y);
        client.emit("getOpponentPostion", gameData.player2.y);
      }
      else
      {
        client.emit("getOpponentPostion", gameData.player1.y);
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
