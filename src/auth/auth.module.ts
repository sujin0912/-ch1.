import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { IdpService } from './idp/idp.service';
import {HttpModule} from '@nestjs/axios';
import {IdpAuthGuard} from './guard/idp-auth/idp-auth.guard';

@Module({
  imports: [
    HttpModule. register({
      timeout: 5000,
      maxRedirects: 0,
    }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    JwtStrategy,
    IdpService,
    IdpAuthGuard,
  ],

  exports: [
    IdpAuthGuard,
    IdpService,
    AuthService,
  ],
  
})
export class AuthModule {}