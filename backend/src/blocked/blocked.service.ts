import { Injectable } from '@nestjs/common';
import { Repository, Not, Equal } from 'typeorm';

@Injectable()
export class BlockedService {
  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(Notification)
  private readonly notificationsRepository: Repository<Notification>){}
  create(userID: Number, blockedID: Number) {

    return 'This action adds a new blocked';
  }

  findAll() {
    return `This action returns all blocked`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blocked`;
  }

  update(id: number) {
    return `This action updates a #${id} blocked`;
  }

  remove(id: number) {
    return `This action removes a #${id} blocked`;
  }
}
