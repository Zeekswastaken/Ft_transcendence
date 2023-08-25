import {Entity, PrimaryColumn, Column, OneToOne,PrimaryGeneratedColumn, Collection, ManyToMany, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {Stats} from './stats.entity';
@Entity()
export class Achievements {
    @PrimaryGeneratedColumn()
    id:Number;
    @Column()
    icon_URL:String;
    @Column()
    name:String;
    @ManyToOne(() => Stats, stats => stats.achievements)
    @JoinColumn({ name: "statsId" })
    stats: Stats;
}