import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/database/channel.entity';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { Message } from 'src/database/message.entity';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { Equal } from 'typeorm';

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
    async saveMsg(text:Partial<Message>, channelid : Number, sender: User, receiver : User){
        const channel = await this.channelRepository.findOne({where: {id : Equal(channelid)}});
        if (!channel)
            throw new HttpException("The channel doesn't exist", HttpStatus.FORBIDDEN);
        const channelMembership1 = 
        this.msg.save(text);
    }
}