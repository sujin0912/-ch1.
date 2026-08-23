import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IdpLoginUrl } from '../type/idp-login-url.type';
import { createHash, randomBytes } from 'crypto';
import { IdpTokenResponse } from '../type/idp-token-response.type';
import { firstValueFrom } from 'rxjs';
import { IdpUserInfo } from '../type/idp-user-info.type';

@Injectable()
export class IdpService {
  private readonly authorizeEndpoint: string;
  private readonly tokenUrl: string;
  private readonly userInfoUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.authorizeEndpoint =
      configService.getOrThrow<string>('IDP_AUTHORIZE_URL');

    this.tokenUrl = configService.getOrThrow<string>('IDP_TOKEN_URL');

    this.userInfoUrl = configService.getOrThrow<string>('IDP_USERINFO_URL');

    this.clientId = configService.getOrThrow<string>('IDP_CLIENT_ID');

    this.clientSecret = configService.getOrThrow<string>('IDP_CLIENT_SECRET');

    this.redirectUri = configService.getOrThrow<string>('IDP_REDIRECT_URI');
  }

  createAuthorizeUrl(): IdpLoginUrl {
    const state = randomBytes(32).toString('base64url');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    return {
      authorizeUrl: `${this.authorizeEndpoint}?${params.toString()}`,
      state,
      codeVerifier,
    };
  }

  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<IdpTokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    const response = await firstValueFrom(
      this.httpService.post<IdpTokenResponse>(this.tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );
    return response.data;
  }

  async getUserInfo(accessToken: string): Promise<IdpUserInfo> {
    const response = await firstValueFrom(
      this.httpService.get<IdpUserInfo>(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
    return response.data;
  }
}
