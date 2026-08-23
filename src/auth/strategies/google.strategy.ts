import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import type { GoogleUser } from '../type/google-user.type';

type GoogleProfile = {
  id: string;
  displayName: string;
  emails?: Array<{
    value: string;
  }>;
  picture?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ): GoogleUser {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException(
        'Google 계정의 이메일을 찾을 수 없습니다.',
      );
    }

    return {
      googleId: profile.id,
      email,
      name: profile.displayName,
      picture: profile.picture,
    };
  }
}
