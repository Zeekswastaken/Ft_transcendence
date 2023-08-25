import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class BlockedUser {
    @PrimaryGeneratedColumn()
    Blockedid:Number;
    
    @ManyToOne(() => User, user => user.blockedUsers)
    @JoinColumn({ name: 'BlockedById' })
    blockedby: User;
  
    @ManyToOne(() => User, user => user.usersBlocked)
    @JoinColumn({ name: 'BlockedUserId' })
    blockeduser: User;
};