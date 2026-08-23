import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async findMine(userId: string) {
    return await this.subscriptionsRepository.findAllByUser(userId);
  }

  async subscribe(userId: string, categoryId: number) {
    const category =
      await this.subscriptionsRepository.findCategory(categoryId);

    if (!category) {
      throw new NotFoundException(
        '구독할 수 있는 카테고리를 찾을 수 없습니다.',
      );
    }

    const existingSubscription =
      await this.subscriptionsRepository.findSubscription(userId, categoryId);

    if (existingSubscription) {
      throw new ConflictException('이미 구독한 카테고리입니다.');
    }

    return await this.subscriptionsRepository.create(userId, categoryId);
  }

  async unsubscribe(userId: string, categoryId: number) {
    const existingSubscription =
      await this.subscriptionsRepository.findSubscription(userId, categoryId);

    if (!existingSubscription) {
      throw new NotFoundException('구독 정보를 찾을 수 없습니다.');
    }

    return await this.subscriptionsRepository.remove(userId, categoryId);
  }
}
