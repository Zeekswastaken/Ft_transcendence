import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
@Unique(["Channelid", "Userid"])
export class ChannelMembership {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  Userid: Number;

  @Column()
  Channelid: Number;

  @Column()
  Type: string;

  @Column({ default: false })
  isMuted: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  muteEndDate: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  banEndDate: Date;

  @ManyToOne(() => Channel, (channel) => channel.memberships, {cascade: true, onDelete: 'CASCADE'} )
  @JoinColumn({ name: 'Channelid', referencedColumnName: 'id' })
  channel: Channel;

  @ManyToOne(() => User, user => user.memberships, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Userid', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Message, message => message.membership )
  messages: Message[];
}