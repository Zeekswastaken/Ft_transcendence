import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembership } from 'src/database/channelMembership.entity';
import { Message } from 'src/database/message.entity';
import { Repository } from 'typeorm';
import { Equal } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(@InjectRepository(ChannelMembership) private readonly ChannelMRepo:Repository<ChannelMembership>,@InjectRepository(Message) private readonly msg:Repository<Message>){}
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
    async saveMsg(text:Partial<Message>){
        this.msg.save(text);
    }
}