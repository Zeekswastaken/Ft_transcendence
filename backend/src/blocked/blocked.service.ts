import {HttpException, HttpStatus,  Injectable } from '@nestjs/common';
import { BlockedUser } from 'src/database/blockedUser.entity';
import { User } from 'src/database/user.entity';
import { UserFriends } from 'src/database/userFriends.entity';
import { Repository, Not, Equal } from 'typeorm';

@Injectable()
export class BlockedService {
  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(BlockedUser)
  private readonly blockedRepository: Repository<BlockedUser>,
  @InjectRepository(UserFriends)
    private readonly userFriendsRepository: Repository<UserFriends>,){}

  async create(userID: Number, blockedID: Number) {
    const user = await this.userRepository.findOne({where: {id:Equal(userID)}, relations: ['blockedUsers', 'usersBlocked']});
    const blockedUser = await this.blockedRepository.findOne({where: {id:Equal(blockedID)}, relations: ['blockedUsers', 'usersBlocked']});
    if (user || !BlockedUser)
      throw new HttpException("The user or the recipient is not found",HttpStatus.FORBIDDEN);
    const friendship = await this.userFriendsRepository.findOne({where: [{sender: Equal(userID), receiver: Equal(blockedID)},{sender: Equal(blockedID), receiver: Equal(userID)}]});
    if (friendship)
      await this.userFriendsRepository.remove(friendship);
    const blocking = new BlockedUser();
    blocking.blockedby = user;
    blocking.blockeduser = blockedUser;
    await this.blockedRepository.save(blocking);
    user.blockedUsers.push(blockedUser);
    blockedUser.usersBlocked.push(user);
    await this.userRepository.save([user, blockedUser]);
  }

  findAll() {
    return `This action returns all blocked`;
  }

  async unblock(userid: Number, recipientid: Number) {
    const user = await this.userRepository.findOne({where:{id:Equal(userid)}, relations: ['blockedUsers', 'usersBlocked']});
    const blocked = await this.userRepository.findOne({where:{id:Equal(recipientid)}, relations: ['blockedUsers', 'usersBlocked']});
    if (!user || !blocked)
      throw new HttpException("The current/blocked user doesn't exist", HttpStatus.FORBIDDEN);
    const search = user.blockedUsers.find(block => block.blockeduser.id == recipientid);
    if (!search)
      throw new HttpException("You do not have the right to unblock this user", HttpStatus.FORBIDDEN);
      await this.blockedRepository.remove(blocked);
  }

  async getblocked(userid: Number): Promise<User[]>
  {
    const user = this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['blockedUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const blocked = user.blockedUsers;
    return (blocked);
  }

  async isBlocked(userid: Number, recipientid: Number): Promise<boolean>
  {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['blockedUsers'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(userid, " ===== ", recipientid);
    const blocked = user.blockedUsers.find(block => block.blockeduser.id == recipientid);
    if (blocked)
      return true;
    else
     return false;
  }

  async isBlocking(userid: Number, recipientid: Number): Promise<boolean>
  {
    const user = await this.userRepository.findOne({
      where: { id: Equal(userid) },
      relations: ['usersBlocked'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(userid, " ===== ", recipientid);
    const blocking = user.usersBlocked.find(block => block.blockedby.id == recipientid);
    if (blocking)
      return true;
    else
     return false;
  }

  update(id: number) {
    return `This action updates a #${id} blocked`;
  }

  remove(id: number) {
    return `This action removes a #${id} blocked`;
  }
}
