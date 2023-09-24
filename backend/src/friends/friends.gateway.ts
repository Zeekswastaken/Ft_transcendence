import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { exit } from 'process';
import { User } from 'src/database/user.entity';
import { SelectQueryBuilder } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly friendsService: FriendsService,
              private readonly jwtService: JwtService,
              private readonly notifService: NotificationsService,
              private readonly channelService: ChannelService,
              private readonly userService: UserService) {}

  @SubscribeMessage('sendFriendRequest')
  async create(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      const recipient = await this.friendsService.create(data.userID, data.recipientID);
      const newNotif = await this.notifService.createFriendNotification(data.userID, data.recipientID);
      const friendnotif = await this.notifService.getFriendNotifs(data.recipientID);
      const gamenotif = await this.notifService.getGameNotifs(data.recipientID);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      this.server.to(recipient.Socket).emit("friend notif", notif);
      this.server.to(recipient.Socket).emit("ispending", notif);
      this.server.to(client.id).emit("ispending", notif);
      const message = "The friend request has been sent";
      this.server.to(recipient.Socket).emit('message', message);
    } catch (error)
    {
      console.error('Error sending the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  @SubscribeMessage('getFriendNotifs')
  async getNotifs(@MessageBody() data: { userID: Number}, @ConnectedSocket() client: Socket) {
    try{
      const friendnotif = await this.notifService.getFriendNotifs(data.userID);
      const gamenotif = await this.notifService.getGameNotifs(data.userID);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      const user = await this.userService.findById(data.userID);
        this.server.to(client.id).emit('friend notif', notif);
    } catch (error)
    {
      client.emit('error', error.message);
      throw error;
    }
  }


  @SubscribeMessage('acceptFriendRequest')
  async accept(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      const test = await this.friendsService.acceptRequest(data.userID, data.recipientID);
      const message = "The friend request has been accepted";
      const accepting = await this.userService.findById(data.userID);
      const waiting = await this.userService.findById(data.recipientID);
      const friendnotif = await this.notifService.getFriendNotifs(data.recipientID);
      const gamenotif = await this.notifService.getGameNotifs(data.recipientID);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      this.server.to(accepting.Socket).emit("friend notif", notif);
      this.server.to(accepting.Socket).emit('isfriend', await this.friendsService.isFriend(data.userID, data.recipientID));
      this.server.to(waiting.Socket).emit('isfriend', await this.friendsService.isFriend(data.recipientID, data.userID));
      this.server.to(accepting.Socket).emit('ispending', await this.friendsService.isPending(data.userID, data.recipientID));
      this.server.to(waiting.Socket).emit('ispending', await this.friendsService.isPending(data.recipientID, data.userID));

    } catch (error)
    {
      console.error('Error accepting the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('denyFriendRequest')
  async deny(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      await this.friendsService.refuseRequest(data.userID, data.recipientID);
      const refusing = await this.userService.findById(data.userID);
      const waiting = await this.userService.findById(data.recipientID);
      const friendnotif = await this.notifService.getFriendNotifs(data.recipientID);
      const gamenotif = await this.notifService.getGameNotifs(data.recipientID);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      this.server.to(refusing.Socket).emit("friend notif", notif);
      this.server.to(refusing.Socket).emit('ispending', await this.friendsService.isPending(data.userID, data.recipientID));
      this.server.to(waiting.Socket).emit('ispending', await this.friendsService.isPending(data.recipientID, data.userID));
      this.server.to(refusing.Socket).emit('isfriend', await this.friendsService.isFriend(data.userID, data.recipientID));
      this.server.to(waiting.Socket).emit('isfriend', await this.friendsService.isFriend(data.recipientID, data.userID));
    }  catch (error)
    {
      console.error('Error refusing the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  
  @SubscribeMessage('Unfriend')
  async remove(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      await this.friendsService.removeFriendship(data.userID, data.recipientID);
      const message = "Unfriended successfully";
      const refusing = await this.userService.findById(data.recipientID);
      const friendnotif = await this.notifService.getFriendNotifs(data.recipientID);
      const gamenotif = await this.notifService.getGameNotifs(data.recipientID);
      const notif = {
        "friendRequest": friendnotif,
        "gameInvite": gamenotif
      };
      this.server.to(refusing.Socket).emit("friend notif", notif);
      this.server.to(refusing.Socket).emit('message', message);
      this.server.to(refusing.Socket).emit('ispending', await this.friendsService.isPending(data.userID, data.recipientID));
      this.server.to(client.id).emit('ispending', await this.friendsService.isPending(data.recipientID,data.userID));
      this.server.to(refusing.Socket).emit('isfriend', await this.friendsService.isFriend(data.userID, data.recipientID));
      this.server.to(client.id).emit('isfriend', await this.friendsService.isFriend(data.recipientID, data.userID));

    } catch (error)
    {
      console.error('Error unfriending the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('checkFriend')
  async check(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      const isfriend = await this.friendsService.isFriend(data.userID, data.recipientID);
      const user = await this.userService.findById(data.userID);
      this.server.to(user.Socket).emit('isfriend' ,isfriend);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('checkPending')
  async checkPend(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{

      const isfriend = await this.friendsService.isPending(data.userID, data.recipientID);
      const user = await this.userService.findById(data.userID);
      this.server.to(user.Socket).emit('ispending' ,isfriend);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  @SubscribeMessage('getFriends')
  async getFriends(@MessageBody() data: { user: any}, @ConnectedSocket() client: Socket) {
    try{
      const friends = await this.friendsService.getUserFriends(data.user);

      const user = await this.userService.findByName(data.user);
      this.server.to(client.id).emit('getfriends' ,friends);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  @SubscribeMessage('GetOnlineFriends')
  async GetOnlineFriends(client:Socket,obj:{id:number}){
    const user = await this.userService.findById(obj.id);
    const friends = await this.friendsService.getUserFriends(user.username);
   friends.forEach((one)=>{console.log(one.username);})
    var OnlineFriends = friends.filter((friend)=>{
        if (friend.status == 'Online')
          return friend;
    });

    this.server.to(client.id).emit("GetOnlineFriends",OnlineFriends);
  }
  @SubscribeMessage('getFriendsWithChannels')
  async getChannelFriends(@MessageBody() data: { user: any}, @ConnectedSocket() client: Socket) {
    try{
      const friends = await this.friendsService.getChannelUserFriends(data.user);

      this.server.to(client.id).emit('getfriendswithchannels' ,friends);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('setIsRead')
  async setRead(@MessageBody() data: { userid: Number, state:boolean}, @ConnectedSocket() client: Socket) {
    try{
      await this.notifService.setRead(data.userid, data.state);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
}
