import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ChannelMembership } from './channelMembership.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    default: () => "TO_CHAR(NOW(), 'HH24:MI')", // CURRENT_TIMESTAMP in hours and minutes
  })
  Created_at: string;
  
  @ManyToOne(() => ChannelMembership, membership => membership.messages)
  @JoinColumn({ name: 'Userid', referencedColumnName: 'Userid', })
  @JoinColumn({ name: 'Channelid', referencedColumnName: 'Channelid' })
  membership: ChannelMembership;
}