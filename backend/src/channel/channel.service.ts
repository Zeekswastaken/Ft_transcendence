import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Channel } from '../database/channel.entity';
import { createChannelDto } from './dto/createChannel.dto';
import { ChannelMembership } from '../database/channelMembership.entity';
import { User } from '../database/user.entity';
import * as bcrypt from 'bcrypt';
import { Equal, In } from 'typeorm';
import { checkPasswordStrength } from 'src/utils/passwordChecker';


@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(ChannelMembership)
        private readonly channelMembershipRepository: Repository<ChannelMembership>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){
    }
    async createChannel(data: any, owner: Number,file: Express.Multer.File) : Promise<Channel| string>
    {
        const channel = new Channel();
        if (data.type == null)
            data.type = "public";
        if (data.name == undefined)
            throw new HttpException("Channel name or Type not specified", HttpStatus.FORBIDDEN);
        channel.Name = data.name;
        channel.Type = data.type;
        if (file)
            channel.avatar = '/avatars/' +file.filename as String;
        const checkChannel = await this.channelRepository.findOne({ where: { Name: data.name } });    
        if (checkChannel)
            throw new HttpException("Channel already exists with the same name", HttpStatus.FORBIDDEN);
        if (data.type === "protected" && data.password)
        {
            const checkPass = checkPasswordStrength(data.password)
            if (checkPass === 'Weak')
                return "Password not strong enough";
            const hashedPass = await this.hashPassword(data.password);
            channel.Password = hashedPass;
        }
        if (data.type === "protected" && !data.password)
            throw new HttpException('Password required', HttpStatus.FORBIDDEN); 
        const membership = new ChannelMembership();
        membership.Userid = owner;
        membership.Type = "owner";
        channel.memberships = [];
        const savedChannel = await this.channelRepository.save(channel);
        membership.Channelid = savedChannel.id
        channel.memberships.push(membership)
        await this.channelMembershipRepository.save(membership);
        return savedChannel;
    }

    async createFriendsChannel(userID:Number, recipientID: Number)
    {
        const initiator = await this.userRepository.findOne({where: { id: Equal(userID)}, relations: ['friendsassender', 'friendsasreceiver']});
        const recipient = await this.userRepository.findOne({where: { id: Equal(recipientID)}, relations: ['friendsassender', 'friendsasreceiver']});
        if (!initiator || !recipient)
            throw new HttpException("User or Recipient not found",HttpStatus.FORBIDDEN);    
        const channel = new Channel();
        channel.Name = Math.random().toString(36).substring(7);
        channel.Type = "Duo";
        
        const membership = new ChannelMembership();
        membership.Userid = initiator.id;
        membership.Type = "owner";
        channel.memberships = [];

        const savedChannel = await this.channelRepository.save(channel);
        membership.Channelid = savedChannel.id
        channel.memberships.push(membership);

        await this.channelMembershipRepository.save(membership);
        await this.joinChannel(savedChannel.id, recipient.id, null);
        return (savedChannel);
    }
    async findById(channelID:number)
    {
        return await this.channelRepository.findOne({where:{ id: Equal(channelID)}});
    }
    async changePass(ChannelID : Number, initiatorID : Number, newPass : String) : Promise<Channel | string>
    {
        const initiator = await this.userRepository.find({where: {id:Equal(initiatorID)}});
        const channel = await this.channelRepository.findOne({ where: { id: Equal(ChannelID) } });
        if (!initiator || !channel)
            throw new HttpException("User or Channel not found",HttpStatus.FORBIDDEN);
        const membership =  await this.channelMembershipRepository.findOne( { where:  {
            user: {id: Equal(initiatorID)}
            , channel:{id: Equal(channel.id)}
            , Type: 'owner'}});
        if (!membership)
            throw new HttpException("User doesn't have the right to perform this action",HttpStatus.FORBIDDEN);
            const checkPass = checkPasswordStrength(newPass)
            if (checkPass === 'Weak')
                return "Password not strong enough";
            const hashedPass = await this.hashPassword(newPass);
        channel.Password = hashedPass;
        return await this.channelRepository.save(channel);
    }
    async assignAdmin(channelID: Number, userId: Number, initiatorId: Number): Promise<ChannelMembership>
    {
        
        const initiator = await this.userRepository.findOne({where: { id: Equal(initiatorId)}});
        const channel = await this.channelRepository.findOne({ where: {id: Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userId)}});
        if (!channel || !user || !initiator)
        throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        
        const membership = await this.channelMembershipRepository.findOne( { where:  {
            user: {id: Equal(user.id)}
            , channel:{id: Equal(channel.id)}
            , Type: 'admin'}});
            if (membership)
            throw new HttpException("The user is already an admin", HttpStatus.FORBIDDEN);
            
            const membership_init = await this.channelMembershipRepository.findOne( { where : {
                user: {id: Equal(initiatorId)}
                , channel:{id: Equal(channel.id)}
                , Type: 'owner'
            }});
            if (!membership_init)
            throw new HttpException("The user can only assign someone as admin if he's the owner of this channel", HttpStatus.FORBIDDEN);
            
            const adminmembership = await this.channelMembershipRepository.findOne( {where: {
                user: {id: Equal(user.id)}
                , channel:{id: Equal(channel.id)}}
            });
            if (!adminmembership)
            throw new HttpException("The user hasn't joined this channel", HttpStatus.FORBIDDEN);
            adminmembership.Type = 'admin';
        return await this.channelMembershipRepository.save(adminmembership);
    }

    async removeAdmin(channelID: Number, userID: Number, initiatorID: Number): Promise<ChannelMembership>
    {
        const initiator = await this.userRepository.findOne({where: { id: Equal(initiatorID)}});
        const channel = await this.channelRepository.findOne({ where: {id : Equal(channelID)}});
        const user = await this.userRepository.findOne({where:{id: Equal(userID)}});
        if (!channel || !user || !initiator)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        
        const ownermembership = await this.channelMembershipRepository.findOne( { where: {
            user: {id: Equal(initiator.id)}
            , channel: {id: Equal(channel.id)}
            , Type: 'owner'
        }})
        if (!ownermembership)
            throw new HttpException("The initiator should be an owner for this action to go through", HttpStatus.FORBIDDEN);
        const updatedmembership = await this.channelMembershipRepository.findOne({ where:
        {user: {id: Equal(user.id)}
         , channel:{id:Equal(channel.id)}
         , Type: 'admin' 
        }})
        if (!updatedmembership)
            throw new HttpException("The user isn't an admin", HttpStatus.FORBIDDEN);
        updatedmembership.Type = 'member';
       return await this.channelMembershipRepository.save(updatedmembership);
    }

    async joinChannel(channelID: Number, userID: Number, Pass: String): Promise<boolean | string>
    {
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        if (user.blacklist)
        {
        const foundChannel = user.blacklist.find(channelID => channelID === channel.id as number)
        if (foundChannel)
        {
            return false; 
        }
        }
        const membership = await this.channelMembershipRepository.findOne({ where: {
            user: {id: Equal(user.id)}
            , channel:{id:Equal(channel.id)}}}
        );
        if (membership)
            throw new HttpException("The User is already in the chat", HttpStatus.FORBIDDEN);
        if (channel.Type == "protected")
        {
            if (!(await this.checkPassword(channelID, Pass)))
            {
                return false;
            }
        }
        const newmembership = new ChannelMembership();
        newmembership.Userid = user.id;
        newmembership.Channelid = channel.id
        newmembership.Type = "member";
        await this.channelMembershipRepository.save(newmembership);
        return true;
    }

    async LeaveChannel(channelID: Number, userID: Number): Promise<Boolean>
    {
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        const membership = await this.channelMembershipRepository.findOne({ where: {
            user: {id: Equal(user.id)}
            , channel:{id:Equal(channel.id)}}}
        );
        if (!membership)
        throw new HttpException("The User hasn't joined the channel", HttpStatus.FORBIDDEN);
        if (membership.Type == "owner")
        {
            const adminmem = await this.channelMembershipRepository.findOne({
                where: { Type: 'admin', Channelid: Equal(channel.id) },
            });
            if (!adminmem)
            {
                const membermem = await this.channelMembershipRepository.findOne({
                    where: { Type: 'member', Channelid: Equal(channel.id) },
                });
                if (!membermem)
                {
                    await this.channelRepository.delete(channel.id.valueOf());
                    return true;
                }
                else{
                    membermem.Type = "owner";
                    await this.channelMembershipRepository.save(membermem);
                }
            }
            else{
            adminmem.Type = "owner";
            await this.channelMembershipRepository.save(adminmem);
            }
        }
        if (membership.isBanned == true || membership.isMuted == true)
        {
            user.blacklist.push(membership.Channelid as number);
            await this.userRepository.save(user);
        }
        await this.channelMembershipRepository.delete(membership.id.valueOf());
        return true
    }

    async muteUser(channelID: Number, userID: Number,initiatorID: Number ,amount: number): Promise<ChannelMembership>
    {
        const channel = await this.channelRepository.findOne({where: {id: Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userID)}});
        const userinit = await this.userRepository.findOne({where: {id: Equal(initiatorID)}});
        if (!channel || !user || !userinit)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        const user2 = await this.channelMembershipRepository.findOne( { where: {Userid: Equal(initiatorID), Type: 'member', Channelid:Equal(channelID)}});
        if (user2)
        {
            throw new HttpException("This User doesn't have the rights to perform this action", HttpStatus.FORBIDDEN);
        }
            const membership = await this.channelMembershipRepository.findOne({
            where: [
              {
                user: { id: Equal(user.id) },
                channel: { id: Equal(channel.id) },
                isMuted: true,
              },
              {
                user: { id: Equal(user.id) },
                channel: { id: Equal(channel.id) },
                isBanned: true,
              },
            ],
        });
        if (membership)
            throw new HttpException("The User might already be Muted/Banned", HttpStatus.FORBIDDEN);
        const normalmembership = await this.channelMembershipRepository.findOne({ where: {
            user: {id: Equal(user.id)}
            , channel:{id:Equal(channel.id)}, isMuted: false}});
        if (normalmembership.Type === 'owner')
            throw new HttpException("This User can't perform this action on an owner", HttpStatus.FORBIDDEN);
        normalmembership.isMuted = true;
        //REMIND YOUSSEF TO GIVE YOU THE AMOUNT IN MINUTES
        normalmembership.muteEndDate = new Date();
        normalmembership.muteEndDate.setMinutes(normalmembership.muteEndDate.getMinutes() + amount);
        return this.channelMembershipRepository.save(normalmembership);
    }

    async banUser(channelID: Number, userID: Number, initiatorID: Number ,amount: number): Promise<ChannelMembership>
    {
        const userinit = await this.userRepository.findOne({where: {id: Equal(initiatorID)}});
        const channel = await this.channelRepository.findOne({where: {id: Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        
        const user2 = await this.channelMembershipRepository.findOne( { where: {Userid: Equal(initiatorID), Type: 'member', Channelid:Equal(channelID)}});
        if (user2)
            throw new HttpException("This User doesn't have the rights to perform this action", HttpStatus.FORBIDDEN);

        const membership = await this.channelMembershipRepository.findOne({
            where: [
              {
                user: { id: Equal(user.id) },
                channel: { id: Equal(channel.id) },
                isMuted: true,
              },
              {
                user: { id: Equal(user.id) },
                channel: { id: Equal(channel.id) },
                isBanned: true,
              },
            ],
        });
        if (membership)
            throw new HttpException("The User might already be Muted/Banned", HttpStatus.FORBIDDEN);
        const normalmembership = await this.channelMembershipRepository.findOne({ where: {
            user: {id: Equal(user.id)}
            , channel:{id:Equal(channel.id)}, isBanned: false}});
            if (normalmembership.Type === 'owner')
            throw new HttpException("This User can't perform this action on an owner", HttpStatus.FORBIDDEN);
            normalmembership.isBanned = true;
        //REMIND YOUSSEF TO GIVE YOU THE AMOUNT IN MINUTES
        normalmembership.banEndDate = new Date();
        normalmembership.banEndDate.setMinutes(normalmembership.banEndDate.getMinutes() + amount);
        return this.channelMembershipRepository.save(normalmembership);
    }

    async unmuteUser(channelID: Number, userID: Number): Promise<ChannelMembership>
    {
        const channel = await this.channelRepository.findOne({where: {id: Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id:Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);

        
         const ismuted = await this.channelMembershipRepository.findOne( { where: {user: {id: Equal(userID)},
            channel: {id: Equal(channelID)},
            isMuted: true}});
        if (!ismuted)
            throw new HttpException("This User isn't muted", HttpStatus.FORBIDDEN);
        
        const membership = await this.channelMembershipRepository.findOne({where:
        {
            user: {id: Equal(userID)},
            channel: {id: Equal(channelID)},
            isMuted : true
        }});
        membership.isMuted = false
        return await this.channelMembershipRepository.save(membership);
    }

    async getAllChannels(userid: Number): Promise<{ channel: Channel; joined: boolean }[]>
    {
        const user = await this.userRepository.findOne({where:{id:Equal(userid)}});
        if (!user)
            throw new HttpException("User not found", HttpStatus.FORBIDDEN);
        const channels = await this.channelRepository.find({
            where: {
                Type: Not(In(["private","Duo"])) 
            },relations:['memberships']
        });
        const channelsWithStatus = channels.map((channel) => ({
            channel,
            joined: (channel.memberships || []).some(
                (membership) =>
                  membership.Userid === user.id && membership.Channelid === channel.id
              ),
            
          }));
        return (channelsWithStatus);  
    } 

    async getInfos(channelID:Number, userID:Number)
    {
        const stats = await this.channelMembershipRepository.findOne({where:{Channelid: Equal(channelID), Userid: Equal(userID)}});
        if (!stats)
            throw new HttpException("Membership not found", HttpStatus.FORBIDDEN);
        return ({Type:stats.Type, isMuted:stats.isMuted, isBanned:stats.isBanned, userID:stats.Userid, channelID:channelID});
    }



    async  getChannel(channelID: Number): Promise<Channel>
    {
        return this.channelRepository.findOne({where: {id: Equal(channelID)}});
    }

    async checkPassword(channelID: Number, password: String): Promise<Boolean>
    {
        if (!password) {
            return false;
          }
      
          const channel = await this.channelRepository.findOne({where: { id: Equal(channelID)}});
      
          if (!channel) {
            return false; // Channel with the specified ID not found
          }
      
          // Compare the provided password with the channel's password hash
          const isPasswordValid = await bcrypt.compare(password, channel.Password);

          return isPasswordValid;
    }

    async unbanUser(channelID: Number, userID: Number): Promise<ChannelMembership>
    {
        const channel = await this.channelRepository.findOne({where: {id: Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id:Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);

        
         const isbanned = await this.channelMembershipRepository.findOne( { where: {user: {id: Equal(userID)},
            channel: {id: Equal(channelID)},
            isBanned: true}});
        if (!isbanned)
            throw new HttpException("This User isn't banned", HttpStatus.FORBIDDEN);
        
        const membership = await this.channelMembershipRepository.findOne({where:
        {
            user: {id: Equal(userID)},
            channel: {id: Equal(channelID)},
            isBanned : true
        }});
        membership.isBanned = false
        membership.banEndDate = undefined;
        return await this.channelMembershipRepository.save(membership);
    }

    async hashPassword(password: String): Promise<String> {
        const saltOrRounds = 10; // The Number of salt rounds (recommended: 10 or higher)
        return await bcrypt.hash(password, saltOrRounds);
    }

     async validateInvitationLink(invitationLink: string): Promise<{isvalid:boolean, channelid:Number}> {
        const splitLink = invitationLink.split('-');
        //Check if link structure is valid
        if (splitLink.length !== 3)
            return {isvalid:false, channelid: null};
        const [channelID, timestamp, randomData] = splitLink;
        const time = Date.now();
        const linkTime = +timestamp;
        const Threshold = 60 * 60 * 1000;
        //Check if the timestamp is expired/not valid
        if (isNaN(linkTime) || time - linkTime > Threshold)
            return {isvalid:false, channelid: null};
        //Check if the channel Id is actually in the database or not
            const checkChannel = await this.channelRepository.findOne({where:{ id: Equal(+channelID)}});
        if (!checkChannel)
            return {isvalid:false, channelid: null};
        return {isvalid:true, channelid: +channelID};
    }

    async generateInvitationLink(channelID: number, userid:Number): Promise<string> {
    const user = this.channelMembershipRepository.find({where:{Userid:Equal(userid), Type:'owner'}});
    if (!user)
        throw new HttpException("This user doesn't have the right to perform this action", HttpStatus.FORBIDDEN);
    const timestamp = Date.now().toString();
    const randomData = Math.random().toString(36).substring(7);
    const token = `${channelID}-${timestamp}-${randomData}`;


    return token;
  }

  async getChannelsJoined(userid : Number): Promise<Channel[]>
  {
    
    const channelmemberships = await this.channelMembershipRepository.find({
        where:{
            Userid: Equal(userid)
        },
            relations: ['channel']
    });
    const filtered = channelmemberships.filter((membership) => membership.channel.Type != 'Duo');
    const channelIds = filtered.map((membership)=> membership.channel);
    return channelIds;
}

    async deletechannel(userid : Number, channelid : Number)
    {
        const user = await this.channelMembershipRepository.findOne({where: {Userid: Equal(userid), Channelid: Equal(userid), Type: 'owner'}});
        if (!user)
            throw new HttpException("You don't have the rights to delete this channel", HttpStatus.FORBIDDEN);
        const channel =  await this.channelRepository.findOne({where:{id:Equal(channelid)}});
        await this.channelRepository.remove(channel);
    }

    async findAndDelete(channelid)
    {
        const channel = await this.channelRepository.findOne({where:{id:Equal(channelid)}});
        await this.channelRepository.remove(channel);
    }

    async getChannelMembers(channelid:Number) : Promise<{owner:ChannelMembership,members:ChannelMembership[]}> 
    {
        const memberships = await this.channelMembershipRepository.find({where:{Channelid: Equal(channelid), Type:Not('owner')}, relations:['user']});
        if (!memberships)
            throw new HttpException("Error getting the members", HttpStatus.FORBIDDEN);
        const owner = await this.channelMembershipRepository.findOne({where:{Channelid: Equal(channelid), Type:'owner'}, relations:['user']})
        const members = {owner:owner, members:memberships};
        return members
    }

    async switchPrivacy(channelID :Number, Password:String) : Promise<Channel | string>
    {
        const channel = await this.channelRepository.findOne({where:{id:Equal(channelID)}});
        if (!channel)
            throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
        if (channel.Type == 'public' && Password)
        {
            const checkPass = checkPasswordStrength(Password);
            if (checkPass == "Weak")
                return "Password not strong enough";
            channel.Type = 'protected';
            const hashedPass = await this.hashPassword(Password);
            channel.Password = hashedPass;
        }
        else
        {
            channel.Type = 'public'
            channel.Password = null;
        }
        return await this.channelRepository.save(channel);
    }
}