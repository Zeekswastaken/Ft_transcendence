import { HttpException, HttpStatus,Injectable } from '@nestjs/common';
import { Notification } from 'src/database/notifications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { UserFriends } from 'src/database/userFriends.entity';
import { User } from 'src/database/user.entity';
@Injectable()
export class NotificationsService {
    constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(UserFriends)
    private readonly userFriendsRepository: Repository<UserFriends>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ){}
    async createFriendNotification(userID:Number, recipientID:Number)
    {
        const initiator = await this.userRepository.findOne({where: { id: Equal(userID)}});
        const recipient = await this.userRepository.findOne({where: { id: Equal(recipientID)}, relations:['receivednotifications']});
        if (!initiator || !recipient)
          throw new HttpException("User or Recipient not found",HttpStatus.FORBIDDEN);    
        const friendship = await this.userFriendsRepository.findOne({where: [{sender: Equal(userID), receiver: Equal(recipientID)},{sender: Equal(recipientID), receiver: Equal(userID)}]});
        if(!friendship)
            throw new HttpException("Friend request not found", HttpStatus.FORBIDDEN);
        const notifs = new Notification();
        notifs.sender = initiator;
        notifs.recipient = recipient;
        notifs.type = "Friend Request";
        notifs.message = "You have received a friend request from: ${intiator.username}";
        notifs.isRead = false;
        notifs.createdAt = new Date();
        recipient.receivednotifications.push(notifs);
        await this.userRepository.save(recipient);
        await this.notificationsRepository.save(notifs);
    }
    
    async getFriendNotifs(userID:Number): Promise<Notification[]>
    {
       const user = await this.userRepository.findOne({where:{id:Equal(userID)}, relations: ['receivednotifications']});
       if (!user)
        throw new HttpException("User not found",HttpStatus.FORBIDDEN);
        const sortedNotifs = user.receivednotifications.filter(notifs => notifs.type == "Friend Request").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return sortedNotifs;
    }
}
