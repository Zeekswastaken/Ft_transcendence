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
  users = new Map<string, string>();
   @WebSocketServer()
   server: Server;
   ///@SubscribeMessage('joinDuo')
   async handleConnection(client:Socket) {
   }
 
   @SubscribeMessage('getSocketId')
   async getSocketId(client:Socket ,obj:{token:string}){
     if (await this.jwt.verify(obj.token))
     {
      // console.log("token = " + obj.token);
       const user = await this.jwt.decoded( obj.token);
       user.Socket = client.id;
       user.status = 'Online';
       console.log(" chat.id == " + client.id)
       await this.userservice.update(user,user.id as number);
       const user2 = await this.userservice.findByName(user.username);

       this.users.set(client.id,await this.jwt.generateToken_2(user2) as string);
     }
   }
   @SubscribeMessage('UserStatus')
   async status(client:Socket,obj:{username:string}){
    // const token = this.users.get(client.id);
    if (obj.username){
      const user = await this.userservice.findByName(obj.username);
      if(user)
      {
        console.log("User == >",user);
        client.emit('GetUserStatus',user);
      }
      // else client.emit('GetUserStatus')
    }
   }

  async handleDisconnect(client: Socket) {
    // const token = client.handshake.query.token;
    //const user = await this.userservice.findBySocket(client.id as string);
    const token = this.users.get(client.id);
    if (token){
      const user = await this.jwt.decoded(token);
      user.Socket = null;
      user.status = 'Offline';
      await this.userservice.update(user,user.id as number);
      console.log("user disconnect ==> "+JSON.stringify(user));
      console.log(`chat.Client disconnected: ${client.id}`);
      this.users.delete(client.id)
    }
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized')
  }

  @SubscribeMessage('Duo')
  async handleMessage(client: Socket, obj: {token:String,name:string}) {
    console.log("kkkk");
    console.log(obj.token);
    console.log("else");
    // const token = client.handshake.query.token;
    // if (await this.jwt.verify(token)){
    //   const user = await this.jwt.decoded(token);
    //   if (this.chatservice.isMatched(payload.channelName,user.id as number))
    //   {
    //     client.to(payload.channelName).emit(payload.token  as string);
    //     await this.chatservice.saveMsg({text:payload.token as string});
    //   }
    // }
    //check if channel added in db
    // client.to(payload.channelId).emit(payload.message);
  }
}
