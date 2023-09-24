
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
import { BlockedService } from 'src/blocked/blocked.service';
@Injectable()
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor (private readonly chatservice:ChatService, private readonly jwt:JWToken,private readonly userservice:UserService,private readonly ChannelService:ChannelService, private readonly blockedService: BlockedService ){}
  users = new Map<string, string>();
   @WebSocketServer()
   server: Server;
   ///@SubscribeMessage('joinDuo')
   async handleConnection(client:Socket) {
   }
 
   @SubscribeMessage('getSocketId&JoinRoom')
   async getSocketId(client:Socket ,obj:{token:string}){
     if (await this.jwt.verify(obj.token))
     {
      const user = await this.jwt.decoded( obj.token);
      user.Socket = client.id;
      user.status = 'Online';
      await this.userservice.update(user,user.id as number);
      const user2 = await this.userservice.findByName(user.username);
      if (user2) {
        const channels = await this.ChannelService.getChannelsJoined(user2.id);
        this.users.set(client.id,await this.jwt.generateToken_2(user2) as string);
          channels.forEach((room)=>{
            client.join(room.id.toString());
          })
          return ({status:"Success"});
      }
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
        client.emit('GetUserStatus',user);
      }
    }
   }

  async handleDisconnect(client: Socket) {
    const token = this.users.get(client.id);
    if (token){
      const user = await this.jwt.decoded(token);
      user.Socket = null;
      user.status = 'Offline';
      await this.userservice.update(user,user.id as number);
      this.Leaveroom(client,{token:token});
      this.users.delete(client.id)
    }
  }

  afterInit(server: Server) {
  }
  @SubscribeMessage('ToRoom')
  async ToRoom(client:Socket,payload:{Token:String,message:String,channelid:Number})
  {
    if (await this.jwt.verify(payload.Token)){
      const sender = await this.jwt.decoded(payload.Token)
      const message = await this.chatservice.saveMsg({text:payload.message as string}, payload.channelid, sender);
      client.leave(payload.channelid.toString());
      this.server.to(payload.channelid.toString()).emit("MessageToRoom",{message: message, user:sender, channelid:payload.channelid});
      client.join(payload.channelid.toString());
    }
    else
      return "Invalid Token";
    //DO THE SAME AS THE DUO ONE
  }
  @SubscribeMessage('JoinRoom')
  async joinroom(client: Socket, payload: { token: string }) {
    if (await this.jwt.verify(payload.token)) {
      const user = await this.jwt.decoded(payload.token);
  
      // Retrieve the list of channels the user has already joined
      const channels = await this.ChannelService.getChannelsJoined(user.id);  
      // Keep track of the rooms the client has already joined
      const roomsJoined = new Set<string>();
  
      channels.forEach((room) => {
        const roomName = room.Name;
  
        // Check if the client has already joined this room
        if (!roomsJoined.has(roomName)) {
          client.join(roomName);
  
          // Add the room to the set of rooms the client has joined
          roomsJoined.add(roomName);
        } else {
          console.log("Client has already joined room:", roomName);
        }
      });
  
      return { status: "Success Joining" };
    }
    return { status: "Invalid Token" };
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

     if (await this.jwt.verify(obj.token)){
      const recuser = await this.userservice.findByName(obj.receiver);
      const sender = await this.jwt.decoded(obj.token)
        client.to(recuser.Socket).emit('ToDuo',{message: obj.message  as string, id:obj.channelid});
        await this.chatservice.saveMsg({text:obj.message as string},obj.channelid, sender);
         }
      else
        return "Invalid Token";
   }
  @SubscribeMessage('getmessages')
  async getMessage(client: Socket, obj: {token:String, channelid:Number}) {
    if (await this.jwt.verify(obj.token)){
      const sender = await this.jwt.decoded(obj.token)
        const messages = await this.chatservice.getmessages(obj.channelid);
        this.server.to(client.id).emit("messages", messages);
      }
    }
    @SubscribeMessage('getGroupMessages')
    async getGroupMessage(client: Socket, obj: {token:String, channelid:Number}) {
      if (await this.jwt.verify(obj.token)){
        const sender = await this.jwt.decoded(obj.token)
          const messages = await this.chatservice.getmessages(obj.channelid)
          // console.log("===============>SOCKET in the chat ", sender.Socket);
          const messagePromises = messages.map((message) =>
          this.blockedService.isBlocked(sender.id, message.user.id)
        );
        
        const isBlockedResults = await Promise.all(messagePromises);
        
        const messagesWithBlocked = messages.map((message, index) => ({
          ...message,
          isBlocked: isBlockedResults[index],
        }));
          this.server.to(client.id).emit("groupmessages", messagesWithBlocked);
        }
      }

    @SubscribeMessage('isDuo')
      async check(client: Socket, obj: {channelid:Number, userid:Number}){
        
        const bool = await this.chatservice.checkDuo(obj.channelid);
        let type;
        if (!bool)
          type = await this.chatservice.getType(obj.channelid, obj.userid);
        const bool2 = {
          bool: bool,
          type: type
        };
        this.server.to(client.id).emit("isduo", bool2);
    }
    @SubscribeMessage("obj")
    async toanother(client:Socket,payload:{obj:any,receiver:string})
    {
      const recuser = await this.userservice.findByName(payload.receiver);
      client.to(recuser.Socket).emit("OBJ",payload.obj as any);
    }
    
}