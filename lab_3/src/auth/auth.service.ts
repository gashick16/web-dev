import * as bcrypt from 'bcrypt';
import axios from 'axios';

import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UsersService,
    private sessionService: SessionsService
  ){}

  async register(registerUserDto: RegisterUserDto) {
    const { login, password } = registerUserDto;
    const user = await this.userService.findOne({ login });

    if(user) {
      throw new BadRequestException('This login is used by another user');
    }

    const passwordHash = await this.hashPassword(password);
    const registredUser = await this.userService.create({
      login,
      passwordHash,
    });

    const [access_token, refreshToken] = await this.generateTokens(registredUser);

    const sessionId = await this.sessionService.create({
      accessToken: access_token,
      refreshToken: refreshToken,
      userId: registredUser.id,
    });

    await this.userService.update(registredUser.id, { sessionId: sessionId });

    return [access_token, refreshToken];
  }

  async login(loginUserDto: LoginUserDto) {
    const { login, password } = loginUserDto;
    const user = await this.userService.findOne({ login });

    if(!user) {
      throw new BadRequestException('User does not exist');
    }

    if(!user.passwordHash) throw new UnauthorizedException();

    const valid = await this.verifyPassword(password, user.passwordHash);

    if(!valid) {
      throw new BadRequestException('Incorrect password');
    }

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = await this.sessionService.getSessionById(user.sessionId);

    if(accessToken && refreshToken) {
      if(await this.verifyAccessToken(accessToken)) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken
        };
      } else if (await this.verifyRefreshToken(refreshToken)) {
        const access_token = await this.generateAccessToken({ id: user.id, login: user.login });

        return {
          access_token: access_token,
          refresh_token: refreshToken
        };
      }
    }

    const [access_token, refresh_token] = await this.generateTokens(user);

    const sessionId = await this.sessionService.create({
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user.id,
    });

    await this.userService.update(user.id, { sessionId: sessionId });

    return {
      access_token,
      refresh_token
    }
  }

  logout() {
    return;
  }

  async logoutAll(userId: string) {
    await this.sessionService.deleteSession(userId);
  }

  async refresh(refreshToken: string) {
    const data = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });

    if (!data) {
      throw new UnauthorizedException();
    }

    const access_token = await this.generateAccessToken(data);

    await this.sessionService.updateSession(data.userId, { accessToken: access_token, refreshToken, userId: data.userId });
    return {
      refresh_token: refreshToken,
      access_token,
    }
  }

  async whoiam(userId: string) {
    return this.userService.findOneById(userId);
  }

  async handleYandexCallback(code: string) {
    const yaClientId = this.configService.get<string>('YANDEX_CLIENT_ID') || '';
    const yaClientSecret = this.configService.get<string>('YANDEX_CLIENT_SECRET') || '';

    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: yaClientId,
      client_secret: yaClientSecret,
    });

    const basicAuth = Buffer.from(`${yaClientId}:${yaClientSecret}`).toString('base64');
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    };

    const { data } = await axios.post('https://oauth.yandex.ru/token', payload.toString(), config);

    // @ts-ignore
    const {access_token, refresh_token, expires_in} = data;
    const userInfo = await axios.get<{
        id: string;
        login: string;
        client_id: string;
        display_name: string;
        real_name: string;
        first_name: string;
        last_name: string;
        sex: string;
        default_email: string;
        emails: string;
        default_phone: string;
        psuid: string;
    }>('https://login.yandex.ru/info', {
      params: {
        format: 'jwt',
        // jwt_secret: yaClientSecret,
      },
      headers: {
        'Authorization': `OAuth ${access_token}`,
      },
    });

    const registredUser = await this.userService.create({
      login: userInfo?.data?.login,
      passwordHash: null,
    });

    const sessionId = await this.sessionService.create({
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: registredUser.id,
    }, expires_in);

    await this.userService.update(registredUser.id, { sessionId: sessionId });
    
    return {
      refresh_token,
      access_token: userInfo.data,
      expires_in,
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS') || 10;
    return bcrypt.hash(password, +saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async generateTokens({ id, login }) {
    return Promise.all([
      this.generateAccessToken({ id, login }),
      this.generateRefreshToken({ id, login }),
    ]);
  }

  private async generateAccessToken({ id, login }) {
    return this.jwtService.signAsync({ id, login }, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: Number(this.configService.get<number>('ACCESS_EXPIRE')),
    });
  }

  private async generateRefreshToken({ id, login }) {
    return this.jwtService.signAsync({ id, login }, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: Number(this.configService.get<number>('REFRESH_EXPIRE')),
    });
  }

  private async verifyAccessToken(access_token: string) {
    try {      
      return await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.get<string>('ACCESS_SECRET'),
      });
    } catch {
      return false;
    }
  }

  private async verifyRefreshToken(refresh_token: string) {
    try {      
      return await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });
    } catch {
      return false;
    }
  }
}
