import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    UsersModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
