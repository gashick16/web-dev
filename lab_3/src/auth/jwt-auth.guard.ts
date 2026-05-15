import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

export interface ExtendedRequest extends Request {
  userId: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const accessToken = this.extractTokenFromCookie(request);

    try {
      //@ts-ignore
      const userId = await this.getUserIdFromToken(accessToken, this.configService.get<string>('ACCESS_SECRET'));

      if (userId) request.userId = userId;
      return true;
    } catch (error) {
      try {
        // @ts-ignore
        const userId = await this.getUserIdFromToken(accessToken, this.configService.get<string>('YANDEX_CLIENT_SECRET'));

        if (userId) request.userId = userId;
        return true;
      } catch (error) {
        return false;
      }
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.access_token;
  }

  private async getUserIdFromToken(access_token: string, secret: string) {
    const payload = await this.jwtService.verifyAsync(access_token, { secret });
    const user = await this.userService.findOne({ login: payload.login });

    //@ts-ignore
    return payload.id ? payload.id : user.id;
  }
}