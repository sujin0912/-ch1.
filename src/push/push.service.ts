import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { catchError, from, map, of, mergeMap, toArray } from 'rxjs';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import type { FakePushResponse } from './type/fake-push-response.type';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly pushServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {
    this.pushServerUrl =
      this.configService.getOrThrow<string>('FAKE_PUSH_BASE_URL');
  }

  async sendToCategorySubscribers(categoryId: number): Promise<void> {
    const subscriptions = await this.subscriptionsRepository
      .findAllByCategory(categoryId)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);

        this.logger.error(`Failed to load subscribers: ${message}`);

        return null;
      });

    if (!subscriptions) {
      return;
    }

    from(subscriptions)
      .pipe(
        mergeMap(() => {
          const deviceId = randomUUID();

          return this.httpService
            .post<FakePushResponse>(`${this.pushServerUrl}/api/push`, {
              deviceId,
            })
            .pipe(
              map(({ data }) => {
                if (data.resultCode === -1) {
                  this.logger.error(
                    `FakePush failed: deviceId=${data.resultData.deviceId}`,
                  );
                }

                return data;
              }),
              catchError((error: unknown) => {
                const message =
                  error instanceof Error ? error.message : String(error);

                this.logger.error(`FakePush request failed: ${message}`);

                return of(null);
              }),
            );
        }, 10),
        toArray(),
      )
      .subscribe({
        next: (results) => {
          const successCount = results.filter(
            (result) => result?.resultCode === 100,
          ).length;
          const failureCount = results.length - successCount;

          this.logger.log(
            `FakePush completed: success=${successCount}, failed=${failureCount}`,
          );
        },
        error: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);

          this.logger.error(`Failed to load subscribers: ${message}`);
        },
      });
  }
}
