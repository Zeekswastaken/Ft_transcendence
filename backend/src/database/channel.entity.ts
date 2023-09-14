import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany} from "typeorm";
import { ChannelMembership} from './channelMembership.entity'
@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: Number;
    @Column()
    Name: string;
    @Column({nullable: true})
    Type:String;
    @Column({nullable: true})
    Password:String;
    @OneToMany(() => ChannelMembership, (membership) => membership.channel)
      memberships: ChannelMembership[];
}