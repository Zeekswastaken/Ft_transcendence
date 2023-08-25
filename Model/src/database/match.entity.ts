import { User } from './user.entity';
import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id:Number;
    @ManyToOne(() => User, (user) => user.player1)
    player1: User;
    @ManyToOne(() => User, (user) => user.player2)
    player2: User;
    @Column()
    player1Score: number;
    @Column()
    player2Score: number;
    @Column()
    result:String;
    @Column()
    Date:Date;
}