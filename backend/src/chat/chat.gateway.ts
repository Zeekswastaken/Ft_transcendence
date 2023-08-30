// src/websocket-gateway/websocket-gateway.gateway.ts
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JWToken } from 'src/auth/jwt.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
@Injectable()
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (private readonly chatservice:ChatService, private readonly jwt:JWToken,private readonly userservice:UserService){}
   @WebSocketServer()
   server: Server;
   ///@SubscribeMessage('joinDuo')
   async handleConnection(obj : {token,client}) {
   }
 
   @SubscribeMessage('getSocketId')
   async getSocketId(client:Socket ,obj:{token:string}){
     if (await this.jwt.verify(obj.token))
     {
      // console.log("token = " + obj.token);
       const user = await this.jwt.decoded( obj.token);
       user.Socket = client.id;
      //  console.log("user = " + JSON.stringify(user));
       console.log(" chat.id == " + client.id)
       await this.userservice.update(user,user.id as number);
     }
   }

  handleDisconnect(client: Socket) {
    const token = client.handshake.query.token;

    console.log(`chat.Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized')
  }

  @SubscribeMessage('Duo')
  async handleMessage(client: Socket, payload: {text:String,channelName:string}) {
    const token = client.handshake.query.token;
    if (await this.jwt.verify(token)){
      const user = await this.jwt.decoded(token);
      if (this.chatservice.isMatched(payload.channelName,user.id as number))
      {
        client.to(payload.channelName).emit(payload.text  as string);
        await this.chatservice.saveMsg({text:payload.text as string});
      }
    }
    //check if channel added in db
    // client.to(payload.channelId).emit(payload.message);
  }
}
