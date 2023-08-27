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
      console.log("------------> ", data.userID);
      console.log("------------> ", data.recipientID);
      const request = await this.friendsService.create(data.userID, data.recipientID);
      console.log("}}}}}}}}}}");
      try {
        const message = "The friend request has been sent";
        client.emit('message', message);
      } catch (error) {
        console.error('Error emitting friendRequest event: ', error.message);
      } 
      // console.log(request)
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
      await this.friendsService.acceptRequest(data.userID, data.recipientID);
      const message = "The friend request has been accepted";
      client.emit('message', message);
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
    const test =  await this.friendsService.refuseRequest(data.userID, data.recipientID);
    const message = "The friend request has been refused";
    client.emit('message', message);
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
       client.emit('message', message);
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
      client.emit('isfriend' ,isfriend);
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
      client.emit('ispending' ,isfriend);
    }catch (error)
    {
      console.error('Error getting the friends of the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
}
