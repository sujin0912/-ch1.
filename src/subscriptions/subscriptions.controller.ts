import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { IdpAuthenticatedRequest } from '../auth/type/idp-authenticated-request.type';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('category subscriptions')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('subscriptions/me')
  findMine(
    @Req()
    request: IdpAuthenticatedRequest,
  ): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionsService.findMine(request.user.id);
  }

  @Post(':categoryId/subscription')
  subscribe(
    @Param('categoryId', ParseIntPipe)
    categoryId: number,
    @Req()
    request: IdpAuthenticatedRequest,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.subscribe(request.user.id, categoryId);
  }

  @Delete(':categoryId/subscription')
  unsubscribe(
    @Param('categoryId', ParseIntPipe)
    categoryId: number,
    @Req()
    request: IdpAuthenticatedRequest,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionsService.unsubscribe(request.user.id, categoryId);
  }
}
