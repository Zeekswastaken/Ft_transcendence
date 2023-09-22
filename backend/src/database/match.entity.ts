import { Stats } from './stats.entity';
import { User } from './user.entity';
import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id:Number;
    @ManyToOne(() => User, (user) => user.player1, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'player1id' })
    player1: User;
    @ManyToOne(() => User, (user) => user.player2, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'player2id' })
    player2: User;
    @Column()
    player1Score: number;
    @Column()
    player2Score: number;
    @Column()
    result:Number;
    @Column({
        default: () => "TO_CHAR(NOW(), 'DD-MM-YYYY HH24:MI')", // Custom date format
      })
      Date: string;
    @ManyToOne(() => Stats, (stats) => stats.matches)
    stats: Stats;
}