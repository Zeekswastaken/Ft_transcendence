import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { BlockedService } from './blocked.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BlockedGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly blockedService: BlockedService) {}

  @SubscribeMessage('Block')
  async create(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try{
      console.log("---------> ", data.userID);
      console.log("---------> ", data.recipientID);
      const request = await this.blockedService.create(data.userID, data.recipientID);
      console.log("REQUEST ====== ", request);  
      const message = "The User has been blocked";
        client.emit('message', message);
      return request;
    } catch (error)
    {
      console.error('Error sending the blocking the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('Unblock')
  async cancel(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      console.log("---------> ", data.userID);
      console.log("---------> ", data.recipientID);
      await this.blockedService.unblock(data.userID, data.recipientID);
      const message = "The user has been unblocked";
      client.emit('message', message);
    } catch(error){
      console.error('Error sending unblocking the user: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('isBlocked')
  async isBlocked(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      console.log("---------> ", data.userID);
      console.log("---------> ", data.recipientID);
      const bool = await this.blockedService.isBlocked(data.userID, data.recipientID);
      console.log("RESULT ======= ", bool);
      client.emit('isblocked', bool);
    } catch(error){
      console.error('Error checking if the user is blocked: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('isBlocking')
  async isBlocking(@MessageBody() data: { userID: Number, recipientID: Number}, @ConnectedSocket() client: Socket) {
    try {
      const bool = await this.blockedService.isBlocking(data.userID, data.recipientID);
      client.emit('isblocking', bool);
    } catch(error){
      console.error('Error checking if the user is blocking you: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
  @SubscribeMessage('getBlocked')
  async getBlocked(@MessageBody() data: { userID: Number}, @ConnectedSocket() client: Socket) {
    try {
      console.log("=========> ", data.userID);
      const blockedUsers = await this.blockedService.getblocked(data.userID);
      client.emit('getblocked', blockedUsers);
    } catch(error){
      console.error('Error getting the blocked users: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }
}
