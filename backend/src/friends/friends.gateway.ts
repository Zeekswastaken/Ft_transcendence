import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
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
      console.log("------------> ", data.userID);
      console.log("------------> ", data.recipientID);
      const recipient = await this.friendsService.create(data.userID, data.recipientID);
      const notif = await this.notifService.createFriendNotification(data.userID, data.recipientID);
      client.emit("friend notif", notif);
        const message = "The friend request has been sent";
        client.to(recipient.Socket).emit('message', message);
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
      console.log("------------> ", data.userID);
      const friendnotif = await this.notifService.getFriendNotifs(data.userID);
      console.log("************** lelelelelelel ", friendnotif);
      const gamenotif = await this.notifService.getGameNotifs(data.userID);
      const notif = {
        "friend request": friendnotif,
        "game invite": gamenotif
      };
      const user = await this.userService.findById(data.userID);
      if (!user)
        console.log('rah cxxxxx' )
      console.log("--------->>>>>>> ", user);
      console.log("--------- ",notif);
      console.log("khkhkhkkhk = ", user.Socket)
      // client.to(user.Socket).emit ("friend notif", notif, (acknowledgement) => {
        // if (acknowledgement === 'success') {
        //   console.log('***************Event emitted successfully');
        // } else {
        //   console.log('****************Event emission failed');
        // }});
        this.server.to(user.Socket).emit('friend notif', notif);
      // console.log(request)
    } catch (error)
    {
      console.error('Error sending the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  // @SubscribeMessage('findOneFriend')
  // findOne(@MessageBody() id: number) {
  //   return this.friendsService.findOne(id);
  // }

  @SubscribeMessage('acceptFriendRequest')
  async accept(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      console.log("-------> user ");
      console.log("-------> user ", data.userID); 
      console.log("-------> recipient ", data.recipientID);
      await this.friendsService.acceptRequest(data.userID, data.recipientID);
      const message = "The friend request has been accepted";
      await this.channelService.createFriendsChannel(data.userID, data.recipientID);
      const accepting = await this.userService.findById(data.userID);
      const waiting = await this.userService.findById(data.recipientID);
      client.to(accepting.Socket).emit('isfriend', await this.friendsService.isFriend(data.userID, data.recipientID));
      client.to(waiting.Socket).emit('isfriend', await this.friendsService.isFriend(data.recipientID, data.userID));
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
      console.log("-------> user ", data.userID); 
      console.log("-------> recipient ", data.recipientID);
      await this.friendsService.refuseRequest(data.userID, data.recipientID);
      const refusing = await this.userService.findById(data.userID);
      const waiting = await this.userService.findById(data.recipientID);
      client.to(refusing.Socket).emit('ispending', await this.friendsService.isPending(data.userID, data.recipientID));
      client.to(waiting.Socket).emit('ispending', await this.friendsService.isPending(data.recipientID, data.userID));
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
      console.log("-------> user ", data.userID); 
      console.log("-------> recipient ", data.recipientID);
      console.log("HERE I AM");
      await this.friendsService.removeFriendship(data.userID, data.recipientID);
      const message = "Unfriended successfully";
      const refusing = await this.userService.findById(data.userID);
      client.to(refusing.Socket).emit('message', message);
      // client.emit('ispending', await this.friendsService.isPending(data.userID, data.recipientID));
    } catch (error)
    {
      console.log("wa33333333333333333333333333333");
      console.error('Error unfriending the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('checkFriend')
  async check(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      console.log("-------> user ", data.userID); 
      console.log("-------> recipient ", data.recipientID);
      const isfriend = await this.friendsService.isFriend(data.userID, data.recipientID);
      const user = await this.userService.findById(data.userID);
      client.to(user.Socket).emit('isfriend' ,isfriend);
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
      console.log("checkPending-------> user ", data.userID); 
      console.log("checkPending-------> recipient ", data.recipientID);
      const isfriend = await this.friendsService.isPending(data.userID, data.recipientID);
      console.log("ispending: ", isfriend);
      const user = await this.userService.findById(data.userID);
      client.to(user.Socket).emit('ispending' ,isfriend);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  @SubscribeMessage('getFriends')
  async getFriends(@MessageBody() data: { userID: Number}, @ConnectedSocket() client: Socket) {
    try{
      console.log("checkPending-------> user ", data.userID); 
      const friends = await this.friendsService.getUserFriends(data.userID);
      console.log("getfriends: ", friends);
      const user = await this.userService.findById(data.userID);
      client.to(user.Socket).emit('getfriends' ,friends);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
}
