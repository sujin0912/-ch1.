import { ConflictException, Injectable,UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {Prisma} from '@prisma/client';
import { User } from '@prisma/client';
import type {IdpUserInfo} from './type/idp-user-info.type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

async findIdpUserBySub(
  providerUserId: string,
) {
  const account =await this.prisma.authAccount.findUnique({
    where: {
      provider_providerUserId: {
        provider: 'INFOTEAM_ACCOUNT',
        providerUserId,
      },
    },
    include: {
      user: true,
    },
  });
  return account?.user ?? null;
}

async findOrCreateUserByIdpUserInfo(
  userInfo: IdpUserInfo,
) {
  const provider = 'INFOTEAM_ACCOUNT';

  const existingAccount = await this.prisma.authAccount.findUnique({
    where: {
      provider_providerUserId:{
        provider,
        providerUserId: userInfo.sub,
      },
    },
    include: {
      user: true,
    },
  });

  if(existingAccount){
    return await this.prisma.user.update({
      where: {
        id: existingAccount.userId,
      },
      data: {
        name: userInfo.name,
        email: userInfo.email,
      },
    });
  }

  return await this.prisma.$transaction(
    async (transactionPrisma) => {
      const existingUser = await transactionPrisma.user.findUnique({
        where: {
          email: userInfo.email,
        },
      });

      if (existingUser) {
        await transactionPrisma.authAccount.create({
          data: {
            provider,
            providerUserId: userInfo.sub,
            userId: existingUser.id,
          },
        });
      
        return await transactionPrisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: userInfo.name,
            email: userInfo.email,
          },
        });
      }

      const newUser = await transactionPrisma.user.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
        },
      });

      await transactionPrisma.authAccount.create({
        data: {
          provider,
          providerUserId: userInfo.sub,
          userId: newUser.id,
        },
      });

      return newUser;
    }
  );
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

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserByEmailOrThrow(email: string){
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