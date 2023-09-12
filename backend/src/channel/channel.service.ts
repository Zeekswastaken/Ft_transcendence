import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Channel } from '../database/channel.entity';
import { createChannelDto } from './dto/createChannel.dto';
import { ChannelMembership } from '../database/channelMembership.entity';
import { User } from '../database/user.entity';
import * as bcrypt from 'bcrypt';
import { Equal } from 'typeorm';

console.log("HEETEe");

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
        console.log('ChannelRepository:', channelRepository);
        console.log('ChannelMembershipRepository:', channelMembershipRepository);
        console.log('UserRepository:', userRepository);}
    async createChannel(createChannelDto: createChannelDto, owner: Number)
    {
        console.log('--------> ', createChannelDto.Name);
        console.log('--------> ', createChannelDto.Type);
        console.log('--------> ', createChannelDto.Password);

        const channel = new Channel();
        if (createChannelDto.Type == null)
            createChannelDto.Type = "public";
        if (createChannelDto.Name == undefined)
            throw new HttpException("Channel name or Type not specified", HttpStatus.FORBIDDEN);
        channel.Name = createChannelDto.Name;
        channel.Type = createChannelDto.Type;
        const checkChannel = await this.channelRepository.findOne({ where: { Name: createChannelDto.Name } });    
        if (checkChannel)
            throw new HttpException("Channel already exists with the same name", HttpStatus.FORBIDDEN);
        if (createChannelDto.Type === "protected" && createChannelDto.Password)
        {
            const hashedPass = await this.hashPassword(createChannelDto.Password);
            channel.Password = hashedPass;
        }
        if (createChannelDto.Type === "protected" && !createChannelDto.Password)
            throw new HttpException('Password required', HttpStatus.FORBIDDEN); 
        // if (createChannelDto.type === "private")
        // {
                //TRY TO THINK OF A WAY FOR INVITATION LINKS TO WORK HERE/// FRIEND LIST
        // }
        
        const membership = new ChannelMembership();
        membership.Userid = owner;
        membership.Channelid = channel.id
        membership.Type = "owner";
        channel.memberships.push(membership)
        const savedChannel = await this.channelRepository.save(channel);
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
        membership.Channelid = channel.id
        membership.Type = "owner";
        channel.memberships.push(membership);
        const savedChannel = await this.channelRepository.save(channel);
        await this.channelMembershipRepository.save(membership);
        await this.joinChannel(savedChannel.id, recipient.id, null);
        return (savedChannel);
    }

    async assignAdmin(channelID: Number, userId: Number, initiatorId: Number): Promise<ChannelMembership>
    {
        
        const initiator = await this.userRepository.findOne({where: { id: Equal(initiatorId)}});
        console.log("-------8888-> ");
        const channel = await this.channelRepository.findOne({ where: {id: Equal(channelID)}});
        console.log("-------8899988-> ");
        const user = await this.userRepository.findOne({where: {id: Equal(userId)}});
        if (!channel || !user || !initiator)
        throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        
        console.log("-------88101010188-> ");
        const membership = await this.channelMembershipRepository.findOne( { where:  {
            user: {id: Equal(user.id)}
            , channel:{id: Equal(channel.id)}
            , Type: 'admin'}});
            console.log("-------88111111188-> ");
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
            console.log("-------8888-> ", adminmembership.Type);
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

    async joinChannel(channelID: Number, userID: Number, Pass: String): Promise<ChannelMembership>
    {
        console.log("-88888-------> ", userID);
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelID)}});
        const user = await this.userRepository.findOne({where: {id: Equal(userID)}});
        if (!channel || !user)
            throw new HttpException("Channel or User not found", HttpStatus.FORBIDDEN);
        console.log("--------> ", user.id);
        const membership = await this.channelMembershipRepository.findOne({ where: {
            user: {id: Equal(user.id)}
            , channel:{id:Equal(channel.id)}}}
        );
        if (membership)
            throw new HttpException("The User is already in the chat", HttpStatus.FORBIDDEN);
        if (channel.Type == "protected")
        {
            if (!this.checkPassword(channelID, Pass))
                throw new HttpException("Password is incorrect", HttpStatus.FORBIDDEN);
        }
        const newmembership = new ChannelMembership();
        newmembership.Userid = user.id;
        newmembership.Channelid = channel.id
        newmembership.Type = "member";
        return await this.channelMembershipRepository.save(newmembership);
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
            adminmem.Type = "owner";
            await this.channelMembershipRepository.save(adminmem);
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
        
        const user2 = await this.channelMembershipRepository.findOne( { where: {Userid: Equal(initiatorID), Type: 'member'}});
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
        
        const user2 = await this.channelMembershipRepository.findOne( { where: {Userid: Equal(initiatorID), Type: 'member'}});
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
        normalmembership.banEndDate.setMinutes(normalmembership.muteEndDate.getMinutes() + amount);
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

    async getAllChannels(): Promise<Channel[]> 
    {
        return this.channelRepository.find({
            where: {
                Type: Not("private")
            },
        });
    }

    async  getChannel(channelID: Number): Promise<Channel>
    {
        return this.channelRepository.findOne({where: {id: Equal(channelID)}});
    }

    async checkPassword(channelID: Number, password: String): Promise<Boolean>
    {
        if (!password)
            return false;
        const pass = await this.channelRepository.findOne({where:{ id: Equal(channelID)}});
        return bcrypt.compare(password , pass);
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

    private async validateInvitationLink(invitationLink: string): Promise<boolean> {
        const splitLink = invitationLink.split('-');
        //Check if link structure is valid
        if (splitLink.length !== 3)
            return false;
        const [channelID, timestamp, randomData] = splitLink;
        const time = Date.now();
        const linkTime = +timestamp;
        const Threshold = 90 * 60 * 1000;
        //Check if the timestamp is expired/not valid
        if (isNaN(linkTime) || time - linkTime > Threshold)
            return false;
        //Check if the channel Id is actually in the database or not
            const checkChannel = await this.channelRepository.findOne({where:{ id: Equal(+channelID)}});
        if (!checkChannel)
            return false;
        return true;
    }

    generateInvitationLink(channelID: number): string {
    const timestamp = Date.now().toString();
    const randomData = Math.random().toString(36).substring(7);
    const token = `${channelID}-${timestamp}-${randomData}`;

    //Construct the full invitation link URL
    const invitationLink = `https://localhost.com:3001/join-channel?token=${token}`;

    return invitationLink;
  }
}