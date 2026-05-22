import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
