import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { channel } from 'diagnostics_channel';
import { Channel } from 'src/database/channel.entity';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { Message } from 'src/database/message.entity';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { Equal, In } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(ChannelMembership) private readonly ChannelMRepo:Repository<ChannelMembership>,@InjectRepository(Message) private readonly msg:Repository<Message>, @InjectRepository(User) private readonly userRepository:Repository<User>,@InjectRepository(Channel) private readonly channelRepository:Repository<Channel> ){}
    async getAllRooms(Userid:number){
        const rooms = await this.ChannelMRepo.find({
            where: { Userid: Equal(Userid)} ,relations: ['Channel'],});
            if (rooms)
            {
                const channelNames = rooms.map(
                    membership => membership.channel.Name
                );
                return channelNames;
            }
            else return null;
        }
    async isMatched(Name:string,Userid:number) {
        // const channel = await this.ChannelMRepo.find({where:{Userid:Equal(Userid),relation}
        const rooms = await this.getAllRooms(Userid);
        return rooms.some(room => room === Name);

    }
    async saveMsg(text:Partial<Message>, channelid : Number, sender: User){
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelid)}, relations: ['memberships', 'memberships.messages']});
        if (!channel)
            throw new HttpException("The channel doesn't exist", HttpStatus.FORBIDDEN);
            const membership = channel.memberships.find(member => member.Userid == sender.id);
        if (!membership)
            throw new HttpException("The user isn't in the channel", HttpStatus.FORBIDDEN);
        const message = await this.msg.save(text);
        membership.messages.push(message);
        await this.ChannelMRepo.save(membership)
        return message;
    }

    async getmessages(channelid: Number) : Promise <{message: Message; user:User}[]>
    {
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelid)}});
        if (!channel)
            throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
        const messagesWithMemberships = await this.msg.find({
            where: { membership: { Channelid: Equal(channelid) } }, relations:['membership'], order: { id: 'ASC'}
           });
        const userIds = messagesWithMemberships.map((message) => message.membership.Userid);
        const users = await this.userRepository.find({
            where: { id: In(userIds) },
          });

        // Create an object array with messages and their corresponding users
        const messagesWithUsers = messagesWithMemberships.map((message) => ({
          message,
          user: users.find((user) => user.id === message.membership.Userid),
        }));
        return messagesWithUsers;
    }
    async checkDuo(channelid:Number):Promise<Boolean>
    {
        const channel = await this.channelRepository.findOne({where:{id: Equal(channelid)}});
        if (!channel)
            throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
        if (channel.Type === "Duo")
            return true;
        return false;
    }

    async getType(channelid : Number, userid : Number) : Promise<String>
    {
        const membership =  await this.ChannelMRepo.findOne({where:{Userid:Equal(userid), Channelid: Equal(channelid)}});
        if (membership)
            return membership.Type;
        return null
    }
}