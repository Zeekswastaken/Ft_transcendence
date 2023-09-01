import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'blocked_user' })
export class BlockedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.blockingUsers, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedById' })
  blockedby: User; //THAT BLOCKED

  @ManyToOne(() => User, user => user.blockedUsers, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedUserId' })
  blockeduser: User; //THAT GOT BLOCKED



  setBlockedRelationship(blockedBy: User, blockedUser: User) {
    this.blockedby = blockedBy;
    this.blockeduser = blockedUser;
    blockedBy.blockingUsers.push(this);
    blockedUser.blockedUsers.push(this);
  }
}