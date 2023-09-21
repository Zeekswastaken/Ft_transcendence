import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class GameInvite {
    @PrimaryGeneratedColumn()
    id:Number;
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "Sender_Id" })
    sender: User;
  
    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: "Receiver_Id" })
    receiver: User;
    @Column({nullable:true})
    type:string;
    @Column({nullable:true})
    status:string;
};