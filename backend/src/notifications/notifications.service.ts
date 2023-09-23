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
        notifs.sender = initiator.id;
        notifs.recipient = recipient.id;
        notifs.type = "Friend Request";
        notifs.message = `${initiator.username} sent you a friend request`;
        notifs.isRead = false;
        notifs.createdAt = new Date();
        recipient.receivednotifications.push(notifs);
        await this.userRepository.save(recipient);
        await this.notificationsRepository.save(notifs);
        // console.log("RECIPIENT ======== ", recipient.receivednotifications);
        return (notifs);
    }
    
    async createGameNotification(userID:Number, recipientID:Number)
    {
        const initiator = await this.userRepository.findOne({where: { id: Equal(userID)}});
        const recipient = await this.userRepository.findOne({where: { id: Equal(recipientID)}, relations:['receivednotifications']});
        if (!initiator || !recipient)
          throw new HttpException("User or Recipient not found",HttpStatus.FORBIDDEN);
        // const friendship = await this.userFriendsRepository.findOne({where: [{sender: Equal(userID), receiver: Equal(recipientID)},{sender: Equal(recipientID), receiver: Equal(userID)}]});
        // if(!friendship)
        //     throw new HttpException("Friend request not found", HttpStatus.FORBIDDEN);
        const notifs = new Notification();
        notifs.sender = initiator.id;
        notifs.recipient = recipient.id;
        notifs.type = "Game invite";
        notifs.message = `${initiator.username} is challenging you to a game`;
        notifs.isRead = false;
        notifs.createdAt = new Date();
        recipient.receivednotifications.push(notifs);
        await this.userRepository.save(recipient);
        await this.notificationsRepository.save(notifs);
        // console.log("LEMME SMASH====== ", notifs.sender);
        // console.log("RECIPIENT ======== ", recipient.receivednotifications[0].recipient);
        return (notifs);
    }

    async getFriendNotifs(userID:Number): Promise<Notification[]>
    {
      // console.log("-------------->", userID);
       const user = await this.userRepository.findOne({where:{id:Equal(userID)}, relations: ['receivednotifications','receivednotifications.sender', 'receivednotifications.recipient']});
       if (!user)
        throw new HttpException("User not found",HttpStatus.FORBIDDEN);
        // console.log("-=-=-=-=-=-=-=-= ",user.receivednotifications);
        const sortedNotifs = user.receivednotifications.filter(notifs => notifs.type == "Friend Request").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // console.log("SORTED      ", sortedNotifs);
        return sortedNotifs;
    }

    async getGameNotifs(userID:Number): Promise<any>
    {
       const user = await this.userRepository.findOne({where:{id:Equal(userID)}, relations: ['receivednotifications', 'receivednotifications.sender', 'receivednotifications.recipient']});
       if (!user)
        throw new HttpException("User not found",HttpStatus.FORBIDDEN);
        const sortedNotifs = user.receivednotifications.filter(notifs => notifs.type == "Game invite").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // console.log("I PUT A HOLE JELLYBEAN UP MY TIIIIIIIIIIT = ",user.receivednotifications[0].sender);
        return (sortedNotifs);
    }

async deleteNotif(recipient: User, sender: User, Type: string) {
    // console.log("PEPEPEPEPPEPEPEPEP");

    const notif = await this.notificationsRepository.findOne({
      where: [
        {
          sender: Equal(sender.id) ,
          recipient: Equal(recipient.id) ,
          type: Equal(Type)
        },
        {
          sender: Equal(recipient.id) ,
          recipient: Equal(sender.id) ,
          type: Equal(Type)
        }
      ]
    });


  if (!notif)
  {
    // console.log("Dunno");
    return ;
  }
  // console.log("ZEZEZEEZEZEZEEZEZEE");

  await this.notificationsRepository.remove(notif);

  // console.log("LELELLELELELELELE");
}

async setRead(userid:Number, state:boolean){
  const user = await this.userRepository.findOne({where:{id:Equal(userid)}});
  if (!user)
    throw new HttpException("User not found", HttpStatus.FORBIDDEN);
  const notifications = await this.notificationsRepository.find({where:{sender:Equal(userid)}});
  if (notifications.length)
  {
    const updatedNotifications = notifications.map(notification => {
      notification.isRead = state;
      return notification;
  });
    await this.notificationsRepository.save(updatedNotifications);
  }
}

}
