import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { createChannelDto } from './dto/createChannel.dto';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
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
              private readonly jwtService: JwtService, private readonly userService: UserService) {}

  @SubscribeMessage('createChannel')
  async create(@MessageBody() data :{ userid:Number, name:String, type:String, password: String, avatar_URL: String}, @ConnectedSocket() client: Socket) {
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
  
  @SubscribeMessage('JoinChannel')
  async Join(@MessageBody() data: { channelID: Number, userID: Number, Pass: string }, @ConnectedSocket() client: Socket){
    try {
    const bool = await this.channelService.joinChannel(data.channelID, data.userID, data.Pass);
    console.log("--------**********------> ", bool);
    this.server.to(client.id).emit("isjoined", bool);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      this.server.to(client.id).emit("isjoined", false);
      throw error;
    }
  }

  @SubscribeMessage('LeaveChannel')
  async Leave(@MessageBody() data: { channelID: Number, userID: Number}, @ConnectedSocket() client: Socket)
  {
    try {
      const channelID = data.channelID; 
      const userID = data.userID;
      console.log("--------> ", data.channelID);
      console.log("--------> ", data.userID);
      client.to(client.id).emit('isleft', await this.channelService.LeaveChannel(data.channelID, data.userID));
    }catch (error){
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
  async getting(@ConnectedSocket() client: Socket,@MessageBody() data: { userID: Number})
  {
    try{
      const channels =  await this.channelService.getChannelsJoined(data.userID)
      // const user = await this.userService.findById(data.userID);
      console.log(data.userID , " CHANNLES JOINED ====== ", channels);

      this.server.to(client.id).emit('getchannelsjoined', channels);
    }
  catch (error) {
    console.error('Error getting the channels joined by the user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('getChannels')
  async getting2(@ConnectedSocket() client: Socket,@MessageBody() data: {userid: Number})
  {
    try{
      // data.userid = 2;
        const channels = await this.channelService.getAllChannels(data.userid);
        console.log("=-=-=-=-=-=-=channels", channels);
        this.server.to(client.id).emit("channels", channels);
    }
  catch (error) {
    console.error('Error getting all the channels by the user: ', error.message);
    throw error;
    }
  }
  @SubscribeMessage('getChannelMembers')
  async getChannelMembers(@ConnectedSocket() client: Socket,@MessageBody() data: {channelid: Number})
  {
    try{
      const channels = await this.channelService.getChannelMembers(data.channelid);
      this.server.to(client.id).emit("members", channels);
    }
    catch(error)
    {
      console.error('Error getting all the channels by the user: ', error.message);
      throw error;  
    }
  }
}