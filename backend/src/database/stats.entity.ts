import {Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, OneToOne,JoinColumn} from "typeorm";
import {User} from './user.entity'
import { Achievements } from "./achievements.entity";
import { Match } from "./match.entity";
@Entity()
export class Stats{
    @PrimaryGeneratedColumn()
    id: Number;
    @Column({nullable:true})
    matches_played:Number;
    @Column({nullable:true})
    wins:Number;
    @Column({nullable:true})
    losses:Number;
    @Column({nullable:true})
    level:Number;
    @Column({nullable:true})
    winrate:Number;
    // @Column()
    // Achievement;
    @OneToOne(() => User, user => user.stats, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User ;
    @OneToMany(() => Achievements, achievements => achievements.stats)
    achievements: Achievements[];
    @OneToMany(()=> Match, matches => matches.stats, { cascade: true, eager: true, onDelete: 'CASCADE' })
    matches: Match[];
}