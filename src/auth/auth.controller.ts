import {
  Get,
  Req,
  UseGuards,
  Body,
  Controller,
  Post,
  Res,
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import type { Request, Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { IdpService } from './idp/idp.service';
import type { IdpCallbackQueryType } from './type/idp-callback-query.type';
import { JwtAuthGuard } from './jwt-auth.guard';

type JwtAuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly idpService: IdpService,
  ) {}

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Get('idp/login')
  loginWithIdp(@Res() response: Response): void {
    const { authorizeUrl, state, codeVerifier } =
      this.idpService.createAuthorizeUrl();

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 10 * 60 * 1000,
      path: '/',
    };

    response.cookie('idp_state', state, cookieOptions);

    response.cookie('idp_code_verifier', codeVerifier, cookieOptions);

    response.redirect(authorizeUrl);
  }

  @Get('idp/callback')
  async idpCallback(
    @Query() query: IdpCallbackQueryType,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    console.log('IDP callback reached', {
      hasCode: Boolean(query.code),
      hasState: Boolean(query.state),
      error: query.error,
    });

    const savedState = request.cookies?.['idp_state'] as string | undefined;

    const codeVerifier = request.cookies?.['idp_code_verifier'] as
      | string
      | undefined;

    const clearIdpCookies = (): void => {
      response.clearCookie('idp_state', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
      });

      response.clearCookie('idp_code_verifier', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
      });
    };

    if (query.error) {
      response.clearCookie('idp_state');
      response.clearCookie('idp_code_verifier');

      throw new UnauthorizedException(
        query.error_description ?? 'IDP 로그인이 취소되었거나 실패했습니다.',
      );
    }

    if (!query.code || !query.state) {
      throw new BadRequestException(
        'Authorization Code 또는 state가 없습니다.',
      );
    }

    if (!savedState || query.state !== savedState) {
      throw new UnauthorizedException('OAuth state가 일치하지 않습니다.');
    }

    if (!codeVerifier) {
      throw new UnauthorizedException('PKCE codeVerifier가 없습니다.');
    }

    let tokens: LoginResponseDto;

    try {
      const idptoken = await this.idpService.exchangeCodeForToken(
        query.code,
        codeVerifier,
      );

      const userInfo = await this.idpService.getUserInfo(idptoken.access_token);

      tokens = await this.authService.loginWithIdp(userInfo);
    } catch (error) {
      clearIdpCookies();
      throw error;
    }

    clearIdpCookies();

    response.status(200).json(tokens);
  }

  @Get('idp/me')
  @UseGuards(JwtAuthGuard)
  getIdpProfile(
    @Req()
    request: JwtAuthenticatedRequest,
  ): {
    user: {
      id: string;
      email: string;
    };
  } {
    return {
      user: request.user,
    };
  }

  @Post('idp/logout')
  logoutWithIdp(@Res() response: Response): void {
    response.clearCookie('idp_access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    response.status(204).send();
  }
}
