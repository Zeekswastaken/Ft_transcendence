// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';

let i = 0;
interface GameData {
  player1: User;
  player2: User;
  score: {
    p1: number;
    p2: number;
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
        console.log("====> i = "+ i);
        await this.connectPlayers({p1Name: "Hamza", p2Name: "Zakaria"});
    }
  }

  @SubscribeMessage('connectPlayers')
  async connectPlayers(obj:{p1Name: string, p2Name: string}) {
    const player1 = await this.userservice.findByName("Hamza");
    const player2 = await this.userservice.findByName("Zakaria");
    const initGameData = {player1: player1, player2: player2, score: {p1: 0, p2: 0}};
    const id: string = player1.username.toString() + player2.username.toString();
    this.GamesData.set(id, initGameData);
    this.server.to(player1.PlayerSocket as string).emit("getOpponent", player2, id);
    this.server.to(player2.PlayerSocket as string).emit("getOpponent", player1, id);
  }

  @SubscribeMessage('gameControler')
  async gameControler(client: Socket, obj:{opponent: User, pos: number}) {
    //console.log(obj.opponent.username + " position: " + obj.pos + "socket: " + obj.opponent.PlayerSocket);
    //this.server.to(obj.opponent.PlayerSocket as string).emit("getOpponentPostion", obj.pos);
  }

  @SubscribeMessage('setPositon')
  async setPosition(client: Socket, obj:{opponent: User, pos: number}) {
    //console.log(obj.opponent.username + " position: " + obj.pos + "socket: " + obj.opponent.PlayerSocket);
    this.server.to(obj.opponent.PlayerSocket as string).emit("getOpponentPostion", obj.pos);
    console.log("Position = " + obj.pos);
  }
}
