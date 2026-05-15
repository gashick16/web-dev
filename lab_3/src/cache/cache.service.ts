import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly prefix: string = 'wp';

  constructor(
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  // Формирование ключа с префиксом
  private getKey(...args: string[]): string {
    return `${this.prefix}:${args.join(':')}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key);
    const data = await this.redis.get(fullKey);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const fullKey = this.getKey(key);
    const serialized = JSON.stringify(value);

    const timeToLive = ttl || this.configService.get<number>('CACHE_TTL_DEFAULT');
    
    if (timeToLive) {
      await this.redis.set(fullKey, serialized, 'EX', timeToLive);
    } else {
      await this.redis.set(fullKey, serialized);
    }
  }

  async del(key: string): Promise<void> {
    const fullKey = this.getKey(key);
    await this.redis.del(fullKey);
  }

  // Удаление по паттерну (используем SCAN для безопасности в продакшене)
  async delByPattern(pattern: string): Promise<void> {
    const fullPattern = this.getKey(pattern);
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', fullPattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } while (cursor !== '0');
  }
}