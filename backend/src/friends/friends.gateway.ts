import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly friendsService: FriendsService,
              private readonly jwtService: JwtService) {}

  @SubscribeMessage('sendFriendRequest')
  async create(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      console.log("---------> ", data.userID);
      console.log("---------> ", data.recipientID);
      const request = await this.friendsService.create(data.userID, data.recipientID);
      console.log("}}}}}}}}}}");
      try {
        const message = "It has been sent";
        client.emit('friendRequest', request);
      } catch (error) {
        console.error('Error emitting friendRequest event: ', error.message);
      }      console.log("{{{{{{{{{{{{{{{{");
      return request;
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
    return await this.friendsService.acceptRequest(data.userID, data.recipientID);
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
    return await this.friendsService.refuseRequest(data.userID, data.recipientID);
    }  catch (error)
    {
      console.error('Error refusing the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  
  @SubscribeMessage('Unfriend')
  remove(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      return this.friendsService.removeFriendship(data.userID, data.recipientID);
    } catch (error)
    {
      console.error('Error unfriending the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('getAllFriends')
  async getAll(@MessageBody() data: { userID: Number}, @ConnectedSocket() client: Socket) {
    try{
        const details = await this.friendsService.getUserFriends(data.userID);
        console.log(details);
        return details;
    } catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('checkFriend')
  async check(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      const isfriend = await this.friendsService.isFriend(data.userID, data.recipientID);
      return isfriend;
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
      return isfriend;
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
}
