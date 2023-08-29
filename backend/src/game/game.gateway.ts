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
  ///@SubscribeMessage('joinDuo')
  async handleConnection(client: Socket) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJoYW16YSIsImdlbmRlciI6IkZlbWFsZSIsImJpcnRoRGF5IjoiMjAyMy0wNy0zMVQyMzowMDowMC4wMDBaIiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vZW5jcnlwdGVkLXRibjAuZ3N0YXRpYy5jb20vaW1hZ2VzP3E9dGJuOkFOZDlHY1JacXRnWjJlVzJGMkh2dkZPcTlSczBrVldpV0pMN3BRYkE1ZyZ1c3FwPUNBVSIsImlhdCI6MTY5MzE1NTE3NCwiZXhwIjoxNjkzMjQxNTc0fQ.afLRIkTdwhJuR-wzv5WspWWe-p6PgqzYuvjsxx8nFos";
    if (await this.jwt.verify(token))
    {
      const user = await this.jwt.decoded(token);
      user.gameSocket = client.id;
      await this.userservice.update(user,user.id as number);
      const current = await this.userservice.findByName(user.username);
      //console.log("USER = "+ JSON.stringify(current));
      //const rooms  = await this.chatservice.getAllRooms(user.id as number);
      //rooms.forEach(room=>{client.join(room)})
      console.log(`Client connected: ${client.id}`);
    }
    //console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('Duo')
  async handleMessage(client: Socket, payload) {
    console.log(`message from client id :${client.id} \n message: `+ payload)
    client.emit("send","Hello from Server")
  }
}