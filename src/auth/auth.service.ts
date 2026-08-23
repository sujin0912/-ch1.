import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './type/jwt-payload.type';
import type { IdpUserInfo } from './type/idp-user-info.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithIdp(userInfo: IdpUserInfo): Promise<LoginResponseDto> {
    const user = await this.authRepository.upsertIdpUser(userInfo);

    return this.issueToken({
      sub: user.id,
      email: user.email,
    });
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.authRepository.findUserByIdOrThrow(payload.sub);

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
      };

      return await this.issueToken(newPayload);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        '유효하지 않거나 만료된 Refresh Token입니다.',
      );
    }
  }

  private async issueToken(payload: JwtPayload): Promise<LoginResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
