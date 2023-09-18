import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/user.entity';
import { UserFriends } from '../database/userFriends.entity'; 
import { Notification } from '../database/notifications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/database/channel.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UserFriends)
    private readonly userFriendsRepository: Repository<UserFriends>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notifService: NotificationsService,
    private readonly channelService: ChannelService,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>
  ) {}

  async create(userid: Number, recipientid: Number) {
    const initiator = await this.userRepository.findOne({where: { id: Equal(userid)}, relations: ['friendsassender', 'friendsasreceiver']});
    const recipient = await this.userRepository.findOne({where: { id: Equal(recipientid)}, relations: ['friendsassender', 'friendsasreceiver']});
    if (!initiator || !recipient)
      throw new HttpException("User or Recipient not found",HttpStatus.FORBIDDEN);
      const friendship = await this.userFriendsRepository.findOne({where: [{sender: Equal(userid), receiver: Equal(recipientid)},{sender: Equal(recipientid), receiver: Equal(userid)}]});
    if (friendship)
      throw new HttpException("The friend request has already been sent/accepted", HttpStatus.FORBIDDEN);
    const actualFriendship = new UserFriends();
    actualFriendship.sender = initiator;
    actualFriendship.receiver = recipient;
    actualFriendship.status = "pending";
    await this.userFriendsRepository.save(actualFriendship);
    initiator.friendsassender.push(actualFriendship);
    // console.log("-----=-=-=-=-> ", initiator.friendsassender)
    recipient.friendsasreceiver.push(actualFriendship);
    await this.userRepository.save(initiator);
    await this.userRepository.save(recipient);
    return recipient;
  }

  findAll() {
    return `This action returns all friends`;
  }

  async acceptRequest(userid: Number, recipientid: Number) {
    const friendship = await this.userFriendsRepository.findOne({
      where: { sender: Equal(recipientid), receiver: Equal(userid)}, relations: ['receiver', 'sender']});
  if (!friendship) {
      throw new HttpException("No request to accept", HttpStatus.FORBIDDEN);
  }
  const accepting = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['friendsasreceiver','receivednotifications']
  });
  const waiting = await this.userRepository.findOne({
    where: { id: Equal(recipientid) },
    relations: ['friendsassender','receivednotifications']
  });
  if (!accepting || !waiting) {
      throw new HttpException("User not found", HttpStatus.FORBIDDEN);
  }
  // console.log("Friendship Receiver ID:", friendship.receiver);
  // console.log("Accepting Sender ID:", accepting.friendsasreceiver[0].sender);
  // console.log("Waiting Receiver ID", waiting.friendsassender[0].receiver);
  const position = waiting.friendsassender.findIndex(
    (friendship2) => friendship2.id === friendship.id
  );
  waiting.friendsassender[position].status = 'accepted';
  const channel = await this.channelService.createFriendsChannel(userid,recipientid);
  friendship.channelid = channel.id;
  await this.userFriendsRepository.save(friendship);
  waiting.friendsassender[position].channelid = friendship.channelid;
  const position2 = accepting.friendsasreceiver.findIndex(
    (friendship2) => friendship2.id === friendship.id
  );

  accepting.friendsasreceiver[position2].status = 'accepted';
  accepting.friendsasreceiver[position2].channelid = friendship.channelid;
  friendship.status = 'accepted';
  await this.userFriendsRepository.save(friendship);
  await this.userRepository.save([accepting, waiting]);
  await this.notifService.deleteNotif(accepting, waiting ,"Friend Request");
  // console.log("---==========> ", accepting.friendsasreceiver[position2].channelid);
}

  

async refuseRequest(userid:Number, recipientid:Number){
    // console.log("Zakaria ghalet");
    const refusing = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['friendsasreceiver','receivednotifications']
  });
  const waiting = await this.userRepository.findOne({
    where: { id: Equal(recipientid) },
    relations: ['friendsassender','receivednotifications']
  });
  if (!refusing || !waiting) {
      throw new HttpException("User not found", HttpStatus.FORBIDDEN);
  }
    const friendship = await this.userFriendsRepository.findOne({where: {sender: Equal(recipientid), receiver: Equal(userid)}});
    if (!friendship)
      throw new HttpException("No request to refuse", HttpStatus.FORBIDDEN);
    await this.userFriendsRepository.remove(friendship);
    await this.notifService.deleteNotif(refusing, waiting ,"Friend Request");
  }

  async removeFriendship(userid:Number, recipientid:Number)
  {

    const refusing = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['friendsasreceiver','receivednotifications']
  });
  const waiting = await this.userRepository.findOne({
    where: { id: Equal(recipientid) },
    relations: ['friendsassender', 'receivednotifications']
  });
  if (!refusing || !waiting) {
      throw new HttpException("User not found", HttpStatus.FORBIDDEN);
  }
    const friendship = await this.userFriendsRepository.findOne({where: [{sender: Equal(userid), receiver: Equal(recipientid)},{ sender: Equal(recipientid), receiver: Equal(userid)}]});
    if (!friendship)
    {
      // console.log("HEEEEEREERERERERERERERERER");
      throw new HttpException("No friendship to remove", HttpStatus.FORBIDDEN);

    }
    // console.log("pepepeppepee");
    await this.channelService.findAndDelete(friendship.id);
    await this.userFriendsRepository.remove(friendship);
      // console.log("leleleleleel");
      await this.notifService.deleteNotif(refusing, waiting ,"Friend Request");
    }

  async getUserFriends(userid: any): Promise<User[]> {
    // console.log("---------->DDDDDDDDDD ", userid);
        const user = await this.userRepository.findOne({
        where: { username: userid },
        relations: ['friendsassender', 'friendsasreceiver'],
      });
    
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      // console.log("---------->DDDDDDDDDD here", user.friendsasreceiver[0]);
      const friends = user.friendsasreceiver
        .concat(user.friendsassender)
        .filter(friendship =>
          friendship.status === 'accepted')
        .map(friendship => friendship.sender.username != userid ? friendship.sender : friendship.receiver);
      
      return friends; 
  }

  async getChannelUserFriends(userid: any): Promise<{ user: User; channelid: Number; }[]> {
    // console.log("---------->DDDDDDDDDD ", userid);
    const user = await this.userRepository.findOne({
      where: { username: userid },
      relations: ['friendsassender', 'friendsasreceiver'],
    });
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    // console.log("---------->DDDDDDDDDD here", user.friendsasreceiver[0]);
    
    const friendsWithChannels = user.friendsasreceiver
      .concat(user.friendsassender)
      .filter(friendship => friendship.status === 'accepted')
      .map(friendship => {
        const friend = friendship.sender.username != userid ? friendship.sender : friendship.receiver;
        const channelid = friendship.channelid ? friendship.channelid : null; // Get the channel ID if available
        
        return { user: friend, channelid: channelid };
      });
      
    return friendsWithChannels;
  }
async isFriend(userid: Number, recipientid: Number): Promise<boolean>
{
  const user = await this.userRepository.findOne({
    where: { id: Equal(userid) },
    relations: ['friendsassender', 'friendsasreceiver'],
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
//  console.log(userid, " ===== ", recipientid);
  const  friends = user.friendsasreceiver
  .concat(user.friendsassender)
  .filter(friendship =>
    friendship.status === 'accepted')
  .find(friend => friend.sender.id == recipientid || friend.receiver.id == recipientid);
  if (friends)
    return true;
  else
    return false;
}

async isPending(userid: Number, recipientid: Number): Promise<any>
{
  const user = await this.userRepository.findOne({
    where: { id: Equal(userid) },
    relations: ['friendsassender', 'friendsasreceiver'],
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
//  console.log(userid, " ===== ", recipientid);
  const  friends = user.friendsasreceiver
  .concat(user.friendsassender)
  .filter(friendship =>
    friendship.status === 'pending')
  .find(friend => friend.sender.id == recipientid || friend.receiver.id == recipientid);
  if (friends)
  {
    // console.log("============= " , friends);
    const friends2 = {
      state: true,
      receiver_username: friends.receiver.username
    }
    return friends2;
  }
    else
    return false;
  }
 
  
  
  //  async findOne(id: Number): Promise<User>{
  //   return await this.user;
  // }

  // update(id: number, updateFriendDto: UpdateFriendDto) {
  //   return `This action updates a #${id} friend`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} friend`;
  // }
}
