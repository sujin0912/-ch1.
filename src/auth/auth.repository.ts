import { Injectable,UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {AuthProvider,Prisma} from '@prisma/client';
import { User } from '@prisma/client';
import type {IdpUserInfo} from './type/idp-user-info.type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

async upsertIdpUser(
  userInfo: IdpUserInfo,
): Promise<User> {
  const authAccount= await this.prisma.authAccount.upsert({
    where: {
      provider_providerUserId: {
        provider: AuthProvider.INFOTEAM_ACCOUNT,
        providerUseId: userInfo.sub,
      },
    },

    update: {
      user: {
        update: {
          name: userInfo.name,
          email: userInfo.name,
        },
      },
    },

    create: {
      provider: 
      AuthProvider.INFOTEAM_ACCOUNT,
      providerUserId: userInfo.sub,

      user: {
        connectOrCreate: {
          where: {
            email: userInfo.email,
          },
          create: {
            name: userInfo.name,
            email: userInfo.email,
          },
        },
      },
    },

    include: {
      user: true,
    },
  });
  return authAccount.user;
}

async findUserByIdOrThrow(
  id: string,
): Promise<User> {
  try {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new UnauthorizedException(
        '유효하지 않은 사용자입니다.',
      );
    }

    throw error;
  }
}

  async findUserByEmail(email: string): Promise<User |null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserByEmailOrThrow(email: string): Promise<User> {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: {
            email,
        },
      });
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.',);
        }
        throw error;
    }

  }
}