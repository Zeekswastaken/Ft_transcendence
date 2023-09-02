// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWToken } from 'src/auth/jwt.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor (private readonly jwt:JWToken,private readonly userservice:UserService){}
  async handleConnection(client: Socket) {
  }
  @SubscribeMessage('getSocketPlayer')
  async getSocketGame(client: Socket,obj:{token:string,username:string}) {
    if (await this.jwt.verify(obj.token))
    {
      const user = await this.jwt.decoded(obj.token);
      user.PlayerSocket = client.id;
      await this.userservice.update(user,user.id as number);
      const oponnent = await this.userservice.findByName(obj.username);
      client.emit("getOpponent", oponnent);
    }
  }

  handleDisconnect(client: Socket) 
  { 
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('setPositon')
  async handleMessage(client: Socket, obj:{opponent: User, pos: number}) {
    //console.log(obj.opponent.username + " position: " + obj.pos + "socket: " + obj.opponent.PlayerSocket);
    this.server.to(obj.opponent.PlayerSocket as string).emit("getOpponentPostion", obj.pos);
  }
}
