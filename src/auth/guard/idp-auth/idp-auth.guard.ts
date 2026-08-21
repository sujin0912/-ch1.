import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService} from '../../auth.service';
import { IdpService} from '../../idp/idp.service';
import type { IdpAuthenticatedRequest} from '../../type/idp-authenticated-request.type';

@Injectable()
export class IdpAuthGuard implements CanActivate {
  constructor(
    private readonly idpService: IdpService,
    private readonly authService: AuthService,
  ) {}

async canActivate(
  context: ExecutionContext,
): Promise<boolean> {
  const request =
    context
      .switchToHttp()
      .getRequest<IdpAuthenticatedRequest>();

  // 1. 쿠키에서 토큰 조회
  const cookieToken =
    request.cookies?.[
      'idp_access_token'
    ];

  // 2. 쿠키에 없으면 Authorization 헤더 확인
  const accessToken =
    typeof cookieToken === 'string'
      ? cookieToken
      : this.extractBearerToken(
          request.headers.authorization,
        );

  // 3. 토큰이 없으면 인증 실패
  if (!accessToken) {
    throw new UnauthorizedException(
      'IDP Access Token이 없습니다.',
    );
  }

  try {
    // 4. Access Token으로 userInfo 조회
    const userInfo =
      await this.idpService.getUserInfo(
        accessToken,
      );

    // 5. userInfo.sub로 DB 사용자 조회
    const user =
      await this.authService.findIdpUserBySub(
        userInfo.sub,
      );

    // 6. 인증된 사용자 정보를 request에 저장
    request.user = {
      id: user.id,
      sub: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
    };

    // 7. Controller 접근 허용
    return true;
  } catch (error) {
    if (
      error instanceof UnauthorizedException
    ) {
      throw error;
    }

    throw new UnauthorizedException(
      '유효하지 않거나 만료된 IDP Access Token입니다.',
    );
  }
}

private extractBearerToken(
  authorization?: string,
): string | undefined {
  if (!authorization) {
    return undefined;
  }

  const [type, token] =
    authorization.split(' ');

  if (type !== 'Bearer' || !token ) {
    return undefined;
  }

  return token;
}
}
