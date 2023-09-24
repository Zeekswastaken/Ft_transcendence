import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { createChannelDto } from './dto/createChannel.dto';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { BlockedService } from 'src/blocked/blocked.service';
import { SocketReadyState } from 'net';
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

  
  @SubscribeMessage('JoinChannel')
  async Join(@MessageBody() data: { channelID: Number, userID: Number, Pass: string }, @ConnectedSocket() client: Socket){
    try {
    const bool = await this.channelService.joinChannel(data.channelID, data.userID, data.Pass);
    this.server.to(client.id).emit("isjoined", bool);
    this.server.to(data.channelID.toString()).emit("members", await this.channelService.getChannelMembers(data.channelID));
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      this.server.to(client.id).emit("isjoined", false);
      throw error;
    }
  }

  @SubscribeMessage('changePass')
  async changePass(@MessageBody() data: { channelID: Number, userID: Number, Pass: string }, @ConnectedSocket() client: Socket)
  {
    try{
    const bool = await this.channelService.changePass(data.channelID, data.userID, data.Pass);
    if (typeof bool == 'object')
      this.server.to(data.channelID.toString()).emit("isPass", true);
    else
    this.server.to(data.channelID.toString()).emit("isPass", bool);
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

      const isleft = await this.channelService.LeaveChannel(data.channelID, data.userID)
      this.server.to(data.channelID.toString()).emit('afterleave', await this.channelService.getChannelMembers(data.channelID));
      this.server.to(client.id).emit('isleft', {isleft:isleft, channels:await this.channelService.getChannelsJoined(data.userID)});
    }catch (error){
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }
  
  @SubscribeMessage('assignAdmin')
  async assignAd(@ConnectedSocket() client: Socket,@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number})
  {
    try {
    const membership = await this.channelService.assignAdmin(data.channelID, data.userID, data.initiatorID);
    client.to(data.channelID.toString()).emit("isadmin", membership);
  }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }

  @SubscribeMessage('removeAdmin')
  async removeAd(@ConnectedSocket() client: Socket,@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number})
  {
    try {
    const membership =  await this.channelService.removeAdmin(data.channelID, data.userID, data.initiatorID);
    client.to(data.channelID.toString()).emit("isadmin", membership);
    }catch (error) {
      console.error('Error joining channel: ', error.message);
      throw error;
    }
  }

  @SubscribeMessage('muteUser')
  async mute(@ConnectedSocket() client: Socket, @MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number, amount: number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      const initiatorID = data.initiatorID;
      const amount = data.amount;
      let bool = false;
      const check = await this.channelService.muteUser(channelID, userID, initiatorID, amount)
      if (check)
          bool = true;
      client.to(channelID.toString()).emit("newmembership", {isMuted:bool, userID:userID, channelID:channelID});
    }
  catch (error) {
    console.error('Error muting user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('unmuteUser')
  async unmute(@ConnectedSocket() client: Socket,@MessageBody() data: { channelID: Number, userID: Number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      let bool = true;
      const check = await this.channelService.unmuteUser(channelID, userID)
      if (check)
        bool = false;
      client.to(channelID.toString()).emit("newmembership", {isMuted:bool, userID:userID, channelID:channelID});
    }
  catch (error) {
    console.error('Error unmuting user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('banUser')
  async ban(@ConnectedSocket() client: Socket,@MessageBody() data: { channelID: Number, userID: Number, initiatorID: Number, amount: number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      const initiatorID = data.initiatorID;
      const amount = data.amount;
      let bool = false;
      const check = await this.channelService.banUser(channelID, userID, initiatorID, amount)
      if (check)
        bool = true;
      client.to(channelID.toString()).emit("newmembership1", {isBanned:bool, userID:userID, channelID:channelID});
    }
  catch (error) {
    console.error('Error banning user: ', error.message);
    throw error;
    }
  }

  @SubscribeMessage('unbanUser')
  async unban(@ConnectedSocket() client: Socket,@MessageBody() data: { channelID: Number, userID: Number})
  {
    try{
      const channelID = data.channelID; 
      const userID = data.userID;
      let bool = true;
      const check = await this.channelService.unbanUser(channelID, userID)
      if (check)
        bool = false;
      client.to(data.channelID.toString()).emit("newmembership1", {isBanned:bool, userID:userID, channelID:channelID});
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
        const channels = await this.channelService.getAllChannels(data.userid);
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

  @SubscribeMessage('getInfos')
  async getInfos(@ConnectedSocket() client: Socket,@MessageBody() data: {channelID: Number, userID: Number})
  {
    try{
      const state = await this.channelService.getInfos(data.channelID, data.userID);
      this.server.to(client.id).emit("state", state);
    }
    catch(error)
    {
      console.error('Error getting all the channels by the user: ', error.message);
      throw error;  
    }
  }
  @SubscribeMessage('switchPrivacy')
  async switchPrivacy(@ConnectedSocket() client: Socket, @MessageBody() data:{channelid: Number, Password:String})
  {
    try{
        const channel = await this.channelService.switchPrivacy(data.channelid, data.Password);
        if (typeof channel == 'object')
          this.server.to(data.channelid.toString()).emit("privacy",channel.Type);
        else
        this.server.to(data.channelid.toString()).emit("privacy",channel);         
        }
    catch(error)
    {
      console.error('Error getting all the channels by the user: ', error.message);
      throw error;  
    }
  }
    @SubscribeMessage('generateLink')
  async generateLink(@ConnectedSocket() client: Socket, @MessageBody() data:{channelid: Number, userid:Number})
  {
    try{
        const channel = await this.channelService.generateInvitationLink(data.channelid as number, data.userid);
          this.server.to(client.id).emit("Link",channel);      
        }
    catch(error)
    {
      console.error('Error getting all the channels by the user: ', error.message);
      throw error;  
    }
  }
  @SubscribeMessage('validateLink')
  async validateLink(@ConnectedSocket() client: Socket, @MessageBody() data:{invite:string})
  {
    try{
        const validate = await this.channelService.validateInvitationLink(data.invite);
          this.server.to(client.id).emit("validatelink",validate);    
        }
    catch(error)
    {
      console.error('Error getting all the channels by the user: ', error.message);
      throw error;  
    }
  }
}