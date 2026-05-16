import type { Response, Request } from 'express';
import { Controller, Post, Body, Res, Req, BadRequestException, Get, UseGuards, Redirect, HttpStatus, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserId } from 'src/users/user-id.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOkResponse({
      example: {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzc4NzkxODk1fQ.XQkSP_GUc7S164ALXqo6pT_g_Mm1WRcaGwOJ6mgwdEk",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzgwMDg3ODM1fQ.rAWBB_xYc48k8bmO3FbTJ-2bh61WcGY97YuUVW0D0A8"
    }
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict' as 'strict',
      secure: false, 
    }
    const [access_token, refresh_token] = await this.authService.register(registerUserDto);

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('ACCESS_EXPIRE', 60) * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('REFRESH_EXPIRE', 1296000) * 1000,
    });

    return { access_token, refresh_token };
  }

  @Post('login')
  @ApiOkResponse({
    example: {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzc4NzkxODk1fQ.XQkSP_GUc7S164ALXqo6pT_g_Mm1WRcaGwOJ6mgwdEk",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzgwMDg3ODM1fQ.rAWBB_xYc48k8bmO3FbTJ-2bh61WcGY97YuUVW0D0A8"
    }
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict' as 'strict',
      secure: false, 
    }
    const {access_token, refresh_token} = await this.authService.login(loginUserDto);

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('ACCESS_EXPIRE', 60) * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('REFRESH_EXPIRE', 1296000) * 1000,
    });

    return { access_token, refresh_token };
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('AccessCookie')
  @Post('logout')
  logout(@Res() res: Response,) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'success_logout'}
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('AccessCookie')
  @Post('logout-all')
  logoutAll(
    @UserId() userId: string,
    @Res() res: Response,
  ) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return this.authService.logoutAll(userId);
  }

  @Post('refresh')
  @ApiSecurity('RefreshCookie')
  @ApiOkResponse({
    example: {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzc4NzkxODk1fQ.XQkSP_GUc7S164ALXqo6pT_g_Mm1WRcaGwOJ6mgwdEk",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNzRjODE1LTEwN2YtNDY2OC05M2I4LWRmYzEzZTFiZjM5ZSIsImxvZ2luIjoidGVzdF8xMCIsImlhdCI6MTc3ODc5MTgzNSwiZXhwIjoxNzgwMDg3ODM1fQ.rAWBB_xYc48k8bmO3FbTJ-2bh61WcGY97YuUVW0D0A8"
    }
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refresh_token } = req.cookies;
    if(!refresh_token) {
      throw new BadRequestException('refresh_token was expire');
    }

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'strict' as 'strict',
      secure: false, 
    }
    const {access_token} = await this.authService.refresh(refresh_token);

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('ACCESS_EXPIRE', 60) * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: this.configService.get<number>('REFRESH_EXPIRE', 1296000) * 1000,
    });

    return { access_token, refresh_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoiam')
  @ApiSecurity('AccessCookie')
  @ApiOkResponse({
    example: {
        "id": "2b74c815-107f-4668-93b8-dfc13e1bf39e",
        "login": "test_10",
        "sessionId": "sess:2b74c815-107f-4668-93b8-dfc13e1bf39e",
        "createdAt": "2026-05-10T13:00:20.783Z",
        "updatedAt": "2026-05-10T13:00:20.800Z"
    }
  })
  async whoiam(
    @UserId() userId: string,
  ) {
    return this.authService.whoiam(userId);
  }

  @Get('oauth/yandex')
  @Redirect()
  async oAuthYandexLogin() {
    const clientId = this.configService.get<string>('YANDEX_CLIENT_ID');
    const redirect_uri = this.configService.get<string>('YANDEX_REDIRECT_URI');
    return {
      url: `https://oauth.yandex.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`,
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    }
  }

  @Get('oauth/yandex/callback')
  @Redirect()
  async oAuthYandexCallBack(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token, expires_in } = await this.authService.handleYandexCallback(code);
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as 'lax',
      secure: false, 
    }

    res.cookie('access_token', access_token, {
      ...cookieOptions,
      maxAge: expires_in * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      ...cookieOptions,
      maxAge: expires_in * 1000,
    });

    return {
      url: '/todos',
      statusCode: HttpStatus.PERMANENT_REDIRECT
    }
  }
}
