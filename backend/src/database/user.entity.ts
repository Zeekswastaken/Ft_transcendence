import {Entity, PrimaryColumn, Column,getRepository, PrimaryGeneratedColumn, AfterInsert,Collection, ManyToMany, JoinTable,OneToMany, ManyToOne, JoinColumn, OneToOne} from "typeorm";
import { ChannelMembership } from "./channelMembership.entity";
import { Stats } from "./stats.entity";
import { GameInvite } from "./gameInvite.entity";
import { Match } from "./match.entity";
import { BlockedUser } from "./blockedUser.entity";
import { Notification } from "./notifications.entity";
import { UserFriends } from "./userFriends.entity";
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: Number;
    @Column({unique: true})
    username: String;
    @Column({nullable:true})
    status:String;
    @Column({nullable:true})
    birthDay: Date;
    @Column({default:'Oauth'})
    password:String;
    @Column({nullable:true})
    gender: String;
    @Column({default:true})
    privacy:Boolean;
    @Column({nullable:true})
    PlayerSocket:String;
    @Column({nullable:true})
    Socket: string;
    @Column({nullable:true,unique:true})
    email:String;
    @Column({nullable:true})
    Bio:String;
    @Column({default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqtgZ2eW2F2HvvFOq9Rs0kVWiWJL7pQbA5g&usqp=CAU"})
    avatar_url: String;
    @OneToMany(() => ChannelMembership, membership => membership.user, /*{ cascade: true, onDelete: 'CASCADE' }*/)
    memberships: ChannelMembership[];
    @OneToMany(() => UserFriends, userFriends => userFriends.sender)
    friendsassender: UserFriends[];
    @OneToMany(() => UserFriends, userFriends => userFriends.receiver)
    friendsasreceiver: UserFriends[];
    
    @OneToOne(() => Stats, stats => stats.user)
    @JoinColumn()
    stats: Stats;
    @OneToMany(() => GameInvite, invite => invite.sender, { cascade: true, onDelete: 'CASCADE' })
    sentinvites: GameInvite[];
    @OneToMany(() => GameInvite, invite => invite.receiver, { cascade: true, onDelete: 'CASCADE' })
    receivedinvites: GameInvite[];
    @OneToMany(() => Match, (matchHisory) => matchHisory.player1, { cascade: true, onDelete: 'CASCADE' })
    public player1: Match[];
    @OneToMany(() => Match, (matchHisory) => matchHisory.player2, { cascade: true, onDelete: 'CASCADE' })
    public player2: Match[];
    @OneToMany(() => BlockedUser, blockedUser => blockedUser.blockedby)
    blockingUsers: BlockedUser[]; //USERS THAT GOT BLOCKED
  
    @OneToMany(() => BlockedUser, blockedUser => blockedUser.blockeduser)
    blockedUsers: BlockedUser[];; //USERS THAT BLOCKED    @Column({ nullable: true })
    @Column({nullable:true})
    twofactorsecret: string;
    @Column({ default: false })
    twofactorenabled: boolean;
    @Column({nullable:true})
    qr_code_url: string;
    @OneToMany(() => Notification, notification => notification.recipient, {cascade:true, onDelete: 'CASCADE'})
    receivednotifications: Notification[];
    user: Promise<String>;
}
