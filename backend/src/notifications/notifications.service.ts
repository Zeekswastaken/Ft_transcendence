import { Injectable } from '@nestjs/common';
import { Notification } from 'src/database/notifications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';

@Injectable()
export class NotificationsService {
    constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    ){}
}
