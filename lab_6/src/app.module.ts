import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    TodosModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASSWORD');
        const host = config.get<string>('MONGO_HOST');
        const port = config.get<string>('MONGO_PORT');
        const db = config.get<string>('MONGO_DB');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${db}`,
          authSource: 'admin',
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SessionsModule,
    RedisModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
