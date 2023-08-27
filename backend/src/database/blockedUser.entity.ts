import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class BlockedUser {
    @PrimaryGeneratedColumn()
    Blockedid:Number;
    
    @ManyToOne(() => User, user => user.blockedUsers, { eager: true , cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'BlockedById' })
    blockedby: User; //THAT BLOCKED
  
    @ManyToOne(() => User, user => user.usersBlocked, { eager: true , cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'BlockedUserId' })
    blockeduser: User; //THAT GOT BLOCKED
};