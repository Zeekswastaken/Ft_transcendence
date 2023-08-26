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
      try {
        const message = "The friend request has been sent";
        client.emit('message', message);
      } catch (error) {
        console.error('Error emitting friendRequest event: ', error.message);
      } 
      return request;
    } catch (error)
    {
      console.error('Error sending the friend request: ',error.message);
      client.emit('error', error.message);
      throw error;
    }
  }

  @SubscribeMessage('findAllBlocked')
  findAll() {
    return this.blockedService.findAll();
  }

  @SubscribeMessage('findOneBlocked')
  findOne(@MessageBody() id: number) {
    return this.blockedService.findOne(id);
  }

  @SubscribeMessage('updateBlocked')
  update() {
  }

  @SubscribeMessage('removeBlocked')
  remove() {
  }
}
