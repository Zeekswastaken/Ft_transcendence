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
    @Column({default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU"})
    avatar:String
    @OneToMany(() => ChannelMembership, (membership) => membership.channel)
      memberships: ChannelMembership[];
}