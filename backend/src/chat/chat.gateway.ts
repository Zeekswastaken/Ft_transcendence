
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JWToken } from 'src/auth/jwt.service';
import { User } from 'src/database/user.entity';
import { UserService } from 'src/user/user.service';
import { channel } from 'diagnostics_channel';
import { ChannelService } from 'src/channel/channel.service';
import { Console } from 'console';
@Injectable()
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (private readonly chatservice:ChatService, private readonly jwt:JWToken,private readonly userservice:UserService,private readonly ChannelService:ChannelService ){}
  users = new Map<string, string>();
   @WebSocketServer()
   server: Server;
   ///@SubscribeMessage('joinDuo')
   async handleConnection(client:Socket) {
    console.log("IM HERERERERRERERER PLZ HELP");
   }
 
   @SubscribeMessage('getSocketId&JoinRoom')
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
      const channels = await this.ChannelService.getChannelsJoined(user2.id);
      this.users.set(client.id,await this.jwt.generateToken_2(user2) as string);
        channels.forEach((room)=>{
          client.join(room.id.toString());
        })
        return ({status:"Success"});
     }
     else
      return ({status:"Invalid Token"});
   }
   @SubscribeMessage('UserStatus')
   async status(client:Socket,obj:{username:string}){
    // const token = this.users.get(client.id);
    if (obj.username){
      const user = await this.userservice.findByName(obj.username);
      if(user)
      {
        // console.log("User == >",user);
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
  @SubscribeMessage('ToRoom')
  async ToRoom(client:Socket,payload:{Token:String,message:String,channelid:Number})
  {
    // await this.chatservice.saveMsg({text:obj.message as string},obj.channelid, user, recuser);
    this.server.to(payload.channelid.toString()).emit("MessageToRoom",payload.message);
    //DO THE SAME AS THE DUO ONE
  }
  @SubscribeMessage('JoinRoom')
  async joinroom(client:Socket,payload : {token:String}){
    if (await this.jwt.verify(payload.token))
    {
      const user = await this.jwt.decoded(payload.token);
      const channels = await this.ChannelService.getChannelsJoined(user.id);
      channels.forEach((room)=>{
        client.join(room.Name);
      })
      return ({status:"Success Joining"});
    }
    return ({status:"Invalid Token"});
  }

  @SubscribeMessage('LeaveRoom')
  async Leaveroom(client:Socket,payload : {token:String}){
    if (await this.jwt.verify(payload.token))
    {
      const user = await this.jwt.decoded(payload.token);
      const channels = await this.ChannelService.getChannelsJoined(user.id);
      channels.forEach((room)=>{
        client.leave(room.Name);
      })
      return ({status:"Success leaving"});
    }
    return ({status:"Invalid Token"});
  }
  @SubscribeMessage('Duo')
  async handleMessage(client: Socket, obj: {token:String,message:String, receiver:string, channelid:Number}) {
    console.log(obj.token);
    console.log("------->MESSAGE ======= ", obj.message);
    //  const token = client.handshake.query.token;
     if (await this.jwt.verify(obj.token)){
      const recuser = await this.userservice.findByName(obj.receiver);
      const sender = await this.jwt.decoded(obj.token)
        client.to(recuser.Socket).emit('ToDuo',obj.message  as string);
        await this.chatservice.saveMsg({text:obj.message as string},obj.channelid, sender);
         }
      else
        return "Invalid Token";
    //check if channel added in db
    // client.to(payload.channelId).emit(payload.message);
   }
  @SubscribeMessage('getmessages')
  async getMessage(client: Socket, obj: {token:String, channelid:Number}) {
    if (await this.jwt.verify(obj.token)){
      const sender = await this.jwt.decoded(obj.token)
        const messages = await this.chatservice.getmessages(obj.channelid);
        console.log("===============>SOCKET in the chat ", sender.Socket);
        this.server.to(client.id).emit("messages", messages);
      }
    }
    @SubscribeMessage('isDuo')
      async check(client: Socket, obj: {channelid:Number}){
        const bool = await this.chatservice.checkDuo(obj.channelid);
        console.log("84848484=45>54 45444454=> ",bool);
        this.server.to(client.id).emit("isduo", bool);
    }
    @SubscribeMessage("obj")
    async toanother(client:Socket,payload:{obj:any,receiver:string})
    {
      const recuser = await this.userservice.findByName(payload.receiver);
      client.to(recuser.Socket).emit("OBJ",payload.obj as any);
    }
}