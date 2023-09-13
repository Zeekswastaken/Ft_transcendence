import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity({ name: 'user_friends' })
export class UserFriends {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  status: String;

  @ManyToOne(() => User, user => user.friendsassender, { eager: true , cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderid' })
  sender: User; 

  @ManyToOne(() => User, user => user.friendsasreceiver, { eager: true, cascade: true, onDelete: 'CASCADE'  })
  @JoinColumn({ name: 'receiverid' })
  receiver: User;

  @Column({nullable: true})
  channelid: Number;
}
