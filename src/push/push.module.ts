import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PushService } from './push.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 0,
    }),
    SubscriptionsModule,
  ],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
