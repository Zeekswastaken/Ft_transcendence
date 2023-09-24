import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ChannelMembership } from './channelMembership.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    default: () => "TO_CHAR(NOW() AT TIME ZONE INTERVAL '+1 hour', 'HH24:MI')",
  })  
  Created_at: string;
  
  @ManyToOne(() => ChannelMembership, membership => membership.messages,{
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Userid', referencedColumnName: 'Userid', })
  @JoinColumn({ name: 'Channelid', referencedColumnName: 'Channelid' })
  membership: ChannelMembership;
}