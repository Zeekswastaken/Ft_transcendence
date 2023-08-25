import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class BlockedUser {
    @PrimaryGeneratedColumn()
    BlockedId:Number;
    
    @ManyToOne(() => User, user => user.blockedUsers)
    @JoinColumn({ name: 'BlockedById' })
    blockedBy: User;
  
    @ManyToOne(() => User, user => user.usersBlocked)
    @JoinColumn({ name: 'BlockedUserId' })
    blockedUser: User;
};