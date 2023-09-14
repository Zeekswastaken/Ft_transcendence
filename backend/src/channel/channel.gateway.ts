import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { createChannelDto } from './dto/createChannel.dto';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
// @UseGuards(AuthGuard())
export class ChannelGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly channelService: ChannelService,
              private readonly jwtService: JwtService) {}

  @SubscribeMessage('createChannel')
  async create(@MessageBody() data :{ userid:Number, name:String, type:String, Password: String, avatar_URL: String}, @ConnectedSocket() client: Socket) {
    try{
    // console.log("====> ", client.id);xxxxx
      // console.log("it kinda worked");
      // const token = client.handshake.query.token;
      // const decodedToken = this.jwtService.verify(token.toString());
      // const userid = decodedToken.sub;
      const channel = await this.channelService.createChannel(data, data.userid);
      console.log("=====> ", channel);
      this.server.emit('channel', channel);
      return channel;
    } catch (error)
    {
      console.error('Error creating channel: ', error.message);
      throw error;
    }
  }
  
  @SubscribeMessage('findAllChannels')
  async findAll() {
    return await this.channelService.getAllChannels();
  }

  @SubscribeMessage('JoinChannel')
  async Join(@MessageBody() data: { channelID: Number, userID: Number, Pass: string }){
    try {
      const channelID = 8; 
      const userID = data.userID;
      const Pass = data.Pass;
    const userid = 1;
    return await this.channelService.joinChannel(channelID, userid, Pass);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }

  @SubscribeMessage('LeaveChannel')
  async Leave(@MessageBody() data: { channelID: Number, userID: Number})
  {
    try {
      const channelID = data.channelID; 
      const userID = data.userID;
      console.log("--------> ", data.channelID);
      console.log("--------> ", data.userID);
    const userid = 2;
    const channelid = 2;
    return await this.channelService.LeaveChannel(channelid, userid);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }
  
  @SubscribeMessage('assignAdmin')
  async assignAd(@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number})
  {
    try {
      const channelID = data.channelID; 
      const userID = data.userID;
      console.log("--------> ", data.channelID);
      console.log("--------> ", data.userID);
    const userid = 2;
    const channelid = 4;
    const initiatorid = 1;
    return await this.channelService.assignAdmin(channelid, userid, initiatorid);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }

  @SubscribeMessage('removeAdmin')
  async removeAd(@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number})
  {
    try {
      const channelID = data.channelID; 
      const userID = data.userID;
      console.log("--------> ", data.channelID);
      console.log("--------> ", data.userID);
    const userid = 2;
    const channelid = 4;
    const initiatorid = 1;
    return await this.channelService.removeAdmin(channelid, userid, initiatorid);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }

  @SubscribeMessage('muteUser')
  async mute(@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number, amount: number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      const initiatorID = data.initiatorID;
      const amount = data.amount;
      return await this.channelService.muteUser(channelID, userID, initiatorID, amount)
    }
  catch (error) {
    console.error('Error muting user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('unmuteUser')
  async unmute(@MessageBody() data: { channelID: Number, userID: Number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      return await this.channelService.unmuteUser(channelID, userID)
    }
  catch (error) {
    console.error('Error unmuting user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('banUser')
  async ban(@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number, amount: number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      const initiatorID = data.initiatorID;
      const amount = data.amount;
      return await this.channelService.banUser(channelID, userID, initiatorID, amount)
    }
  catch (error) {
    console.error('Error banning user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('unbanUser')
  async unban(@MessageBody() data: { channelID: Number, userID: Number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      return await this.channelService.unbanUser(channelID, userID)
    }
  catch (error) {
    console.error('Error unbanning user: ', error.message);
    throw error;
    }
  }
  @SubscribeMessage('getChannelsJoined')
  async getting(@MessageBody() data: { userID: Number})
  {
    try{
      return await this.channelService.getChannelsJoined(data.userID)
    }
  catch (error) {
    console.error('Error getting the channels joined by the user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('getChannels')
  async getting2(@ConnectedSocket() client: Socket)
  {
    try{
        const channels = await this.channelService.getAllChannels();
        this.server.to(client.id).emit("channels", channels);
    }
  catch (error) {
    console.error('Error getting all the channels by the user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('getChannels')
  async delete(@ConnectedSocket() client: Socket,@MessageBody() data: {userid: Number, channelid: Number})
  {
    try{
        const channels = await this.channelService.getAllChannels();
        this.server.to(client.id).emit("channels", channels);
    }
  catch (error) {
    console.error('Error getting all the channels by the user: ', error.message);
    throw error;
    }
  }
}