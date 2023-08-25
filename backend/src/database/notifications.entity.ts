import { Entity, PrimaryGeneratedColumn, CreateDateColumn,Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Notification   {
  
  @PrimaryGeneratedColumn()
  id:Number;
  
  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  recipient: User;

  @Column()
  type: String; // Either a friend request or a game invitation

  @Column({ default: false })
  isRead: boolean;

  @Column()
  message: string; 

  @CreateDateColumn()
  createdAt: Date;
}