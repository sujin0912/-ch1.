import {Get, Req, UseGuards, Body, Controller, Post } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
@UseGuards(AuthGuard('google'))
async googleLogin() {
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleCallback(@Req() req) {
  return req.user;
}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
    );
  }

  @Post('logout')
  logout() {
    return {
      message: '로그아웃되었습니다.',
    };
  }
}