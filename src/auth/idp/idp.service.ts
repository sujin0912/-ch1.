import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { ConfigService} from '@nestjs/config';
import { IdpLoginUrl} from '../type/idp-login-url.type';
import { createHash, randomBytes} from 'crypto';
import { IdpTokenResponse} from '../type/idp-token-response.type';
import { firstValueFrom} from 'rxjs';
import { IdpUserInfo} from '../type/idp-user-info.type';

@Injectable()
export class IdpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  createAuthorizeUrl(): IdpLoginUrl {
    const authorizeEndpoint = this.configService.getOrThrow<string>('IDP_AUTHORIZE_URL');
    const clientId = this.configService.getOrThrow<string>('IDP_CLIENT_ID');
    const redirectUri = this.configService.getOrThrow<string>('IDP_REDIRECT_URI');
    const state = randomBytes(32).toString('base64url');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge =
      createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

  console.log('OAuth request:', {
  authorizeEndpoint,
  clientIdExists: Boolean(clientId),
  redirectUri,
  scope: params.get('scope'),
  challengeMethod:
    params.get('code_challenge_method'),
  challengeExists:
    Boolean(params.get('code_challenge')),
});

    return {
      authorizeUrl: `${authorizeEndpoint}?${params.toString()}`,
      state,
      codeVerifier,
    };
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<IdpTokenResponse>{
    const tokenUrl = this.configService.getOrThrow<string>(
      'IDP_TOKEN_URL'
    );

    const clientId = this.configService.getOrThrow<string>(
      'IDP_CLIENT_ID'
    );

    const clientSecret = this.configService.getOrThrow<string>(
      'IDP_CLIENT_SECRET'
    );

    const redirectUri = this.configService.getOrThrow<string>(
      'IDP_REDIRECT_URI'
    );

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    const response = await firstValueFrom(
      this.httpService.post<IdpTokenResponse>(
        tokenUrl, 
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    return response.data;
  }

  async getUserInfo(accessToken: string): Promise<IdpUserInfo> {
    const userInfoUrl = this.configService.getOrThrow<string>(
      'IDP_USERINFO_URL'
    );

    const response = await firstValueFrom(
      this.httpService.get<IdpUserInfo>(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
    );
    return response.data;
  }
}
